## 2026-07-18 - Avoid WebGL buffer reallocation and GC overhead in R3F
**Learning:** Passing a new array reference like `[new Float32Array(...)]` to `args` inside `<bufferAttribute>` triggers costly WebGL buffer reallocation on every render. Additionally, creating intermediate 3D objects (like `new THREE.Vector3`) just to extract coordinates adds unnecessary garbage collection overhead.
**Action:** Fully memoize typed arrays and pass the stable reference to `args`. Extract primitive coordinates directly into flat arrays instead of creating intermediate 3D objects inside iteration loops.
