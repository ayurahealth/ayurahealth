## 2026-07-14 - WebGL Buffer Reallocation in R3F
**Learning:** Passing a new Float32Array instance to <bufferAttribute args={[...]}> on every render triggers costly WebGL buffer reallocations, and creating intermediate THREE.Vector3 objects just to extract their components creates unnecessary memory allocation and GC overhead.
**Action:** Fully memoize Float32Array references and populate them directly with primitive coordinate values instead of intermediate 3D objects.
