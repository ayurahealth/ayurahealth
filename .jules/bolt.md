
## 2024-05-24 - Avoid WebGL buffer reallocation in @react-three/fiber
**Learning:** In `@react-three/fiber`, passing a new array reference like `[new Float32Array(...)]` inline to `<bufferAttribute args={...}>` causes WebGL buffer reallocation on every single render, heavily impacting frame rates. Additionally, creating intermediate `THREE.Vector3` objects inside loops just to extract their components creates unnecessary memory allocation and garbage collection overhead.
**Action:** Always fully memoize typed arrays (e.g., `Float32Array`) and pass the stable reference to `args`. Push primitive coordinate values directly into the array rather than instantiating intermediate objects.
