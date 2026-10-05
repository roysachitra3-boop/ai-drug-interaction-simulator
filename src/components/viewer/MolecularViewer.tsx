import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Grid } from "@react-three/drei";
import { RotateCcw } from "lucide-react";
import { InteractionModel } from "./InteractionModel";
import { Button } from "@/components/ui/button";

type Props = {
  drugUrl?: string | null | undefined;
  proteinUrl?: string | null | undefined;
  drugLabel?: string | undefined;
  proteinLabel?: string | undefined;
  /** when true the two models approach, merge and fragment */
  active?: boolean | undefined;
  /** seconds the full interaction animation takes */
  duration?: number | undefined;
};

function InteractionClock({
  active,
  duration,
  progress,
}: {
  active: boolean;
  duration: number;
  progress: React.RefObject<number>;
}) {
  useFrame((_, delta) => {
    const step = delta / (active ? duration : 0.9);
    const next = (progress.current ?? 0) + (active ? step : -step);
    progress.current = Math.min(1, Math.max(0, next));
  });
  return null;
}

export default function MolecularViewer({
  drugUrl,
  proteinUrl,
  drugLabel = "Drug",
  proteinLabel = "Protein",
  active = false,
  duration = 4.2,
}: Props) {
  const controls = useRef<any>(null);
  const progress = useRef(0);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-card">
      <Canvas camera={{ position: [0, 1.4, 6.5], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={["#070c14"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 4]} intensity={1.4} />
        <directionalLight position={[-5, -2, -4]} intensity={0.5} color="#38bdf8" />
        <hemisphereLight args={["#9ed8ff", "#0b1220", 0.7]} />
        <pointLight position={[0, 4, -6]} intensity={0.8} color="#a5b4fc" />
        <InteractionClock active={active} duration={duration} progress={progress} />
        <Suspense
          fallback={
            <Html center>
              <span className="text-xs tracking-widest text-muted-foreground">LOADING MODELS…</span>
            </Html>
          }
        >
          {proteinUrl && (
            <InteractionModel
              key={proteinUrl}
              url={proteinUrl}
              targetSize={3}
              home={[1.4, 0, 0]}
              progress={progress}
            />
          )}
          {drugUrl && (
            <InteractionModel
              key={drugUrl}
              url={drugUrl}
              targetSize={1.6}
              home={[-2, 0, 0]}
              progress={progress}
            />
          )}
        </Suspense>

        <Grid
          args={[24, 24]}
          position={[0, -2.2, 0]}
          cellColor="#123043"
          sectionColor="#1c4a63"
          fadeDistance={22}
          infiniteGrid
        />
        <OrbitControls ref={controls} enablePan enableZoom enableRotate makeDefault />
      </Canvas>

      <div className="pointer-events-none absolute left-3 top-3 space-y-1 text-[11px] tracking-widest">
        <div className="rounded-md bg-background/70 px-2 py-1 text-accent">● {drugLabel}</div>
        <div className="rounded-md bg-background/70 px-2 py-1 text-primary">● {proteinLabel}</div>
      </div>

      <div className="absolute bottom-3 right-3">
        <Button size="sm" variant="secondary" onClick={() => controls.current?.reset()}>
          <RotateCcw className="mr-1.5 size-3.5" /> Reset view
        </Button>
      </div>
      <p className="pointer-events-none absolute bottom-3 left-3 text-[11px] text-muted-foreground">
        Drag to rotate · Scroll to zoom · Right-drag to pan
      </p>
    </div>
  );
}
