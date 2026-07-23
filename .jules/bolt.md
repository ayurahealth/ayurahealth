## 2026-07-23 - Prevent WebGL Buffer Reallocation
**Learning:** In @react-three/fiber, passing a new typed array reference to `args` in `<bufferAttribute>` triggers a costly WebGL buffer reallocation on every render. Intermediate 3D objects (like `THREE.Vector3`) inside iteration loops also create unnecessary memory allocation and garbage collection overhead.
**Action:** Always prepare flat coordinate arrays directly from primitive coordinate values and fully memoize the resulting typed array to pass a stable reference to `args`.
