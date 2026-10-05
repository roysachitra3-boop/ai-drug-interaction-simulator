import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type Props = {
  url: string;
  /** target size of the longest bounding-box axis */
  targetSize?: number;
  position?: [number, number, number];
  tint?: string;
};

/**
 * Loads a supplied GLB model, centers it on its own origin and normalizes its
 * scale so different files can be shown side by side.
 */
export function ModelLoader({ url, targetSize = 2, position = [0, 0, 0], tint }: Props) {
  const { scene } = useGLTF(url);

  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxAxis;
    clone.position.set(-center.x, -center.y, -center.z);
    if (tint) {
      clone.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh) {
          const mat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
          if (mat.color) mat.color.lerp(new THREE.Color(tint), 0.45);
          mesh.material = mat;
        }
      });
    }
    const wrapper = new THREE.Group();
    wrapper.add(clone);
    wrapper.scale.setScalar(scale);
    return wrapper;
  }, [scene, targetSize, tint]);

  return <primitive object={prepared} position={position} />;
}
