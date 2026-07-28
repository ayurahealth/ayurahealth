## 2024-05-30 - [Optimize WebGL Buffer Allocation]
**Learning:** Passing a new array reference (like `[new Float32Array(...)]`) inside `<bufferAttribute args={...}>` in React Three Fiber triggers costly WebGL buffer reallocations on every single render. Also, creating intermediate `THREE.Vector3` objects inside loops just to extract their components creates significant garbage collection overhead.
**Action:** Always fully memoize typed arrays passed to `<bufferAttribute>` and avoid intermediate 3D object allocations in performance-critical rendering loops.
