## 2024-08-15 - Optimizing WebGL buffer coordinate allocation
**Learning:** When preparing flat coordinate arrays for WebGL buffers (like in `@react-three/fiber`), avoiding the creation of intermediate 3D objects (e.g., `new THREE.Vector3(...)`) inside iteration loops just to extract their components significantly reduces memory allocation and garbage collection overhead.
**Action:** Always push or spread primitive coordinate values directly into the flat array when constructing geometry buffers to minimize memory allocation and GC pauses.
