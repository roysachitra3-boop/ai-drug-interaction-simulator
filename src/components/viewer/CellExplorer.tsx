import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Grid } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw, X, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CELL_PARTS, type CellPart } from "@/data/cellParts";

type Entry = {
  part: CellPart;
  object: THREE.Object3D;
  origin: THREE.Vector3;
  dir: THREE.Vector3;
  materials: THREE.MeshStandardMaterial[];
  baseEmissive: THREE.Color[];
};

function CellModel({
  url,
  selected,
  onSelect,
}: {
  url: string;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const { scene } = useGLTF(url);

  const { wrapper, entries } = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    clone.position.set(-center.x, -center.y, -center.z);

    const wrap = new THREE.Group();
    wrap.add(clone);
    wrap.scale.setScalar(3.4 / maxAxis);

    const list: Entry[] = [];
    for (const part of CELL_PARTS) {
      for (const nodeName of part.nodes) {
        const object = clone.getObjectByName(nodeName);
        if (!object) continue;

        const nodeBox = new THREE.Box3().setFromObject(object);
        const nodeCenter = new THREE.Vector3();
        nodeBox.getCenter(nodeCenter);
        const dir = nodeCenter.sub(center);
        if (dir.lengthSq() < 1e-6) dir.set(0, 1, 0);
        dir.normalize();

        const materials: THREE.MeshStandardMaterial[] = [];
        const baseEmissive: THREE.Color[] = [];
        object.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          const mat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mesh.material = mat;
          materials.push(mat);
          baseEmissive.push(mat.emissive ? mat.emissive.clone() : new THREE.Color(0, 0, 0));
        });

        list.push({
          part,
          object,
          origin: object.position.clone(),
          dir,
          materials,
          baseEmissive,
        });
      }
    }
    return { wrapper: wrap, entries: list };
  }, [scene]);

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 4);
    for (const entry of entries) {
      const isSelected = entry.part.id === selected;
      const push = isSelected ? 1.9 : selected ? -0.15 : 0;
      const target = entry.origin.clone().addScaledVector(entry.dir, push);
      entry.object.position.lerp(target, k);

      const targetOpacity = !selected ? 1 : isSelected ? 1 : 0.14;
      const glow = isSelected ? 0.55 : 0;
      entry.materials.forEach((mat, i) => {
        mat.opacity += (targetOpacity - mat.opacity) * k;
        mat.depthWrite = mat.opacity > 0.85;
        if (mat.emissive) {
          const base = entry.baseEmissive[i] ?? new THREE.Color(0, 0, 0);
          mat.emissive.lerp(
            isSelected ? new THREE.Color("#38bdf8").multiplyScalar(glow) : base,
            k,
          );
        }
      });
    }
  });

  const resolvePart = (object: THREE.Object3D | null): string | null => {
    let current: THREE.Object3D | null = object;
    while (current) {
      const hit = entries.find((e) => e.object === current);
      if (hit) return hit.part.id;
      current = current.parent;
    }
    return null;
  };

  return (
    <primitive
      object={wrapper}
      onPointerDown={(e: any) => {
        const id = resolvePart(e.object);
        if (!id) return;
        e.stopPropagation();
        onSelect(id);
      }}
      onPointerMove={(e: any) => {
        document.body.style.cursor = resolvePart(e.object) ? "pointer" : "auto";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    />
  );
}


export default function CellExplorer({ url, label = "Human Cell" }: { url: string; label?: string | undefined }) {
  const controls = useRef<any>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const active = CELL_PARTS.find((p) => p.id === selected) ?? null;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-card">
      <Canvas camera={{ position: [0, 1.2, 6.2], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={["#070c14"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 4]} intensity={1.4} />
        <directionalLight position={[-5, -2, -4]} intensity={0.5} color="#38bdf8" />
        <hemisphereLight args={["#9ed8ff", "#0b1220", 0.7]} />
        <pointLight position={[0, 4, -6]} intensity={0.8} color="#a5b4fc" />
        <Suspense
          fallback={
            <Html center>
              <span className="text-xs tracking-widest text-muted-foreground">LOADING CELL…</span>
            </Html>
          }
        >
          <CellModel url={url} selected={selected} onSelect={setSelected} />
        </Suspense>
        <Grid
          args={[24, 24]}
          position={[0, -2, 0]}
          cellColor="#123043"
          sectionColor="#1c4a63"
          fadeDistance={22}
          infiniteGrid
        />
        <OrbitControls ref={controls} enablePan enableZoom enableRotate makeDefault />
      </Canvas>

      {/* holographic frame */}
      <div className="pointer-events-none absolute inset-3 rounded-lg border border-primary/20" />

      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-background/70 px-2 py-1 label-mono text-primary">
        ● {label}
      </div>

      {/* organelle index */}
      <div className="absolute right-3 top-3 max-h-[65%] w-40 overflow-y-auto rounded-lg border border-primary/25 bg-background/80 p-1.5 backdrop-blur md:w-52">
        <p className="px-1.5 py-1 label-mono text-muted-foreground">Structures</p>
        {CELL_PARTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(selected === p.id ? null : p.id)}
            className={`block w-full rounded-md px-2 py-1.5 text-left text-[11px] transition-colors md:text-xs ${
              selected === p.id
                ? "bg-primary/20 text-primary glow-ring"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* bottom info panel */}
      {active && (
        <div className="absolute inset-x-3 bottom-3 animate-fade-in rounded-lg border border-primary/30 bg-background/90 p-3 backdrop-blur md:inset-x-auto md:left-3 md:max-w-md md:p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="label-mono text-accent">Isolated component</p>
              <h3 className="mt-0.5 text-lg font-bold text-primary md:text-xl">{active.name}</h3>
            </div>
            <Button size="icon" variant="ghost" className="size-7" onClick={() => setSelected(null)}>
              <X className="size-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:text-sm">
            {active.description}
          </p>
        </div>
      )}

      <div className="absolute bottom-3 right-3 flex gap-2">
        {selected && (
          <Button size="sm" variant="secondary" onClick={() => setSelected(null)}>
            <Crosshair className="mr-1.5 size-3.5" /> Reassemble
          </Button>
        )}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setSelected(null);
            controls.current?.reset();
          }}
        >
          <RotateCcw className="mr-1.5 size-3.5" /> Reset view
        </Button>
      </div>

      {!active && (
        <p className="pointer-events-none absolute bottom-3 left-3 text-[11px] text-muted-foreground">
          Click a structure to isolate it · Drag to rotate · Scroll to zoom
        </p>
      )}
    </div>
  );
}
