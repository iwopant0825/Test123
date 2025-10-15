import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { Group } from "three";
import { GLTFLoader, DRACOLoader } from "three-stdlib";
import type { GLTF } from "three-stdlib";

// For many formats, async loader wrappers exist in drei, but
// to keep it compact here we primarily support gltf/glb with GLTFLoader.
// You can extend this switch later with OBJLoader, FBXLoader, etc.

export type ModelDetails = {
  vertices: number;
  triangles: number;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
};

type Props = {
  url: string;
  ext: string;
  onLoaded?: (info: ModelDetails) => void;
};

export default function ModelLoader({ url, ext, onLoaded }: Props) {
  const lower = ext.toLowerCase();

  // Hooks must be called unconditionally; prepare loaders for supported formats
  const gltf = useLoader(
    GLTFLoader,
    lower === "gltf" || lower === "glb"
      ? url
      : (undefined as unknown as string),
    (loader) => {
      // attach DRACO decoder for compressed meshes
      const draco = new DRACOLoader();
      // Use CDN decoder; vite will fetch from network
      draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
      (loader as GLTFLoader).setDRACOLoader(draco);
    }
  ) as unknown as GLTF | undefined;

  const details = useMemo(() => {
    if (!(lower === "gltf" || lower === "glb") || !gltf) return null;

    let vertices = 0;
    let triangles = 0;
    const bbox = new THREE.Box3();
    bbox.makeEmpty();

    gltf.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      const geom = (mesh as THREE.Mesh).geometry as
        | THREE.BufferGeometry
        | undefined;
      if (geom) {
        const pos = geom.attributes.position;
        if (pos) {
          vertices += pos.count;
          const tri = geom.index ? geom.index.count / 3 : pos.count / 3;
          triangles += Math.floor(tri);
        }
        geom.computeBoundingBox();
        if (geom.boundingBox) {
          bbox.union(geom.boundingBox);
        }
      }
    });

    const size = new THREE.Vector3();
    bbox.getSize(size);
    return { vertices, triangles, sizeX: size.x, sizeY: size.y, sizeZ: size.z };
  }, [lower, gltf]);

  useEffect(() => {
    if (details) onLoaded?.(details);
  }, [details, onLoaded]);

  if (lower === "gltf" || lower === "glb") {
    if (!gltf) return null;
    return <primitive object={gltf.scene as Group} />;
  }

  return null;
}
