## 2024-05-24 - Optimize WebGL buffer allocation
**Learning:** In @react-three/fiber, passing a new array reference to args (e.g., [new Float32Array(...)]) inside <bufferAttribute> triggers costly WebGL buffer reallocation on every render. Also, creating intermediate 3D objects like THREE.Vector3 inside iteration loops just to extract their components is expensive.
**Action:** Fully memoize typed arrays and pass the stable reference to args. Push or spread primitive coordinate values directly into flat arrays instead of creating intermediate 3D objects.
