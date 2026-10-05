import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Grid } from "@react-three/drei";
import { RotateCcw } from "lucide-react";
import { ModelLoader } from "./ModelLoader";
import { Button } from "@/components/ui/button";

type Props = {
  url: string;
  label?: string | undefined;
};

export default function SingleModelViewer({ url, label = "Model" }: Props) {
  const controls = useRef<any>(null);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-card">
      <Canvas camera={{ position: [0, 1.2, 5.5], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={["#070c14"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 4]} intensity={1.4} />
        <directionalLight position={[-5, -2, -4]} intensity={0.5} color="#38bdf8" />
        <hemisphereLight args={["#9ed8ff", "#0b1220", 0.7]} />
        <pointLight position={[0, 4, -6]} intensity={0.8} color="#a5b4fc" />
        <Suspense
          fallback={
            <Html center>
              <span className="text-xs tracking-widest text-muted-foreground">LOADING MODEL…</span>
            </Html>
          }
        >
          <ModelLoader url={url} targetSize={3.4} />
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

      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-background/70 px-2 py-1 text-[11px] tracking-widest text-primary">
        ● {label}
      </div>
      <div className="absolute bottom-3 right-3">
        <Button size="sm" variant="secondary" onClick={() => controls.current?.reset()}>
          <RotateCcw className="mr-1.5 size-3.5" /> Reset view
        </Button>
      </div>
    </div>
  );
}
