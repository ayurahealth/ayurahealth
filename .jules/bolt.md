## 2026-07-15 - Optimizing WebGL Buffer Attributes
**Learning:** Passing a new array reference to `args` (like `[new Float32Array(...)]`) inside `<bufferAttribute>` in `@react-three/fiber` triggers costly WebGL buffer reallocation on every render. Additionally, creating intermediate `THREE.Vector3` objects just to extract coordinates introduces unnecessary garbage collection overhead.
**Action:** Always memoize typed arrays fully and pass the stable reference to `args`. Push primitive coordinate values directly into the array to minimize memory allocation.
