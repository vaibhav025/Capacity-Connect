# Trainer model

Place a licensed, professionally styled instructor at `public/models/trainer.glb` and restart Vite (or rebuild). The model is discovered at build time; absent files are never requested. Binary GLB with embedded textures is recommended. GLTF with relative resources is also supported.

Use a neutral forward-facing pose, Y up, baked lighting where possible, fewer than 50k triangles, and compressed or small textures; target a file below 3 MB. The loader centres and normalises the model to the scene. The procedural learning instrument remains visible on loading failure. Mobile, coarse-pointer devices and reduced-motion users receive the static illustration. No model or third-party licence is included.
