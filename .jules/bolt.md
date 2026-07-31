## 2026-07-31 - WebGL Buffer Reallocation
**Learning:** In @react-three/fiber, passing a new array reference to args (e.g., [new Float32Array(...)]) inside <bufferAttribute> triggers costly WebGL buffer reallocation on every render. Additionally, creating intermediate THREE.Vector3 objects inside iteration loops just to extract their components adds memory allocation and garbage collection overhead.
**Action:** Fully memoize typed arrays and pass the stable reference to args. Push or spread primitive coordinate values directly into the array instead of using intermediate 3D objects.
