import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type Props = {
  url: string;
  /** target size of the longest bounding-box axis */
  targetSize?: number;
  /** resting position when no interaction is running */
  home: [number, number, number];
  /** shared 0..1 interaction progress */
  progress: RefObject<number>;
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

type Piece = {
  mesh: THREE.Mesh;
  base: THREE.Vector3;
  dir: THREE.Vector3;
  spin: THREE.Vector3;
  emissive?: THREE.Color;
};

/**
 * Loads a GLB model and animates it through the interaction sequence:
 * the model drifts toward the interaction centre, flashes as it merges and
 * then breaks apart piece by piece.
 */
export function InteractionModel({ url, targetSize = 2, home, progress }: Props) {
  const { scene } = useGLTF(url);
  const group = useRef<THREE.Group>(null);

  const { object, pieces, spread } = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxAxis;
    clone.position.set(-center.x, -center.y, -center.z);

    const list: Piece[] = [];
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const source = mesh.material as THREE.Material | THREE.Material[];
      const mat = (Array.isArray(source) ? source[0]! : source).clone() as THREE.MeshStandardMaterial;
      mesh.material = mat;
      const dir = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      );
      if (dir.lengthSq() < 0.001) dir.set(0, 1, 0);
      dir.normalize();
      list.push({
        mesh,
        base: mesh.position.clone(),
        dir,
        spin: new THREE.Vector3(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
        ),
        ...(mat.emissive ? { emissive: mat.emissive.clone() } : {}),
      });
    });

    const wrapper = new THREE.Group();
    wrapper.add(clone);
    wrapper.scale.setScalar(scale);
    return { object: wrapper, pieces: list, spread: maxAxis * 0.22 };
  }, [scene, targetSize]);

  useFrame(() => {
    const p = THREE.MathUtils.clamp(progress.current ?? 0, 0, 1);
    const g = group.current;
    if (!g) return;

    // Phase 1: approach the interaction centre.
    const approach = easeInOut(THREE.MathUtils.clamp(p / 0.6, 0, 1));
    const pull = 1 - 0.85 * approach;
    g.position.set(home[0] * pull, home[1] * pull, home[2] * pull);
    g.rotation.y = approach * 0.6;

    // Phase 2: merge flash, then fragment piece by piece.
    const frag = easeInOut(THREE.MathUtils.clamp((p - 0.6) / 0.4, 0, 1));
    const flash = p > 0.45 ? Math.max(0, 1 - Math.abs(p - 0.62) / 0.18) : 0;

    for (const piece of pieces) {
      const offset = frag * spread;
      piece.mesh.position.set(
        piece.base.x + piece.dir.x * offset,
        piece.base.y + piece.dir.y * offset,
        piece.base.z + piece.dir.z * offset,
      );
      piece.mesh.rotation.set(
        piece.spin.x * frag,
        piece.spin.y * frag,
        piece.spin.z * frag,
      );
      const mat = piece.mesh.material as THREE.MeshStandardMaterial;
      if (piece.emissive && mat.emissive) {
        mat.emissive.copy(piece.emissive).lerp(new THREE.Color("#38bdf8"), flash * 0.9);
        mat.emissiveIntensity = 1 + flash * 1.6;
      }
      if (mat.transparent !== undefined) {
        const fade = 1 - frag * 0.45;
        if (fade < 1) {
          mat.transparent = true;
          mat.opacity = fade;
        }
      }
    }
  });

  return <primitive ref={group} object={object} position={home} />;
}
