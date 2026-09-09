import { Box3, Group, Mesh, Material, Texture, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Vite discovers only real assets. Missing models produce no network request.
const models = import.meta.glob("/public/models/*.{glb,gltf}", {
  query: "?url",
  import: "default",
  eager: true,
});
export async function loadTrainerModel(): Promise<Group | null> {
  const path = Object.keys(models).find((key) =>
    /\/trainer\.(glb|gltf)$/.test(key),
  );
  if (!path) return null;
  try {
    const { scene } = await new GLTFLoader().loadAsync(String(models[path]));
    const bounds = new Box3().setFromObject(scene);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    scene.position.sub(center);
    const wrapper = new Group();
    wrapper.add(scene);
    wrapper.scale.setScalar(2.8 / Math.max(size.x, size.y, size.z, 0.01));
    return wrapper;
  } catch {
    return null;
  }
}

export function disposeObject(root: Group) {
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.geometry.dispose();
    (Array.isArray(object.material)
      ? object.material
      : [object.material]
    ).forEach((material) => {
      materials.add(material);
      Object.values(material).forEach((value) => {
        if (value instanceof Texture) textures.add(value);
      });
    });
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
}
