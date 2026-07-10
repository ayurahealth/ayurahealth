## 2024-07-10 - WebGL Buffer Attribute Reallocation
**Learning:** Passing a new typed array reference directly to bufferAttribute args (e.g., `[new Float32Array(...)]`) causes costly WebGL buffer reallocation on every component render in @react-three/fiber.
**Action:** Fully memoize typed arrays and pass the stable reference to prevent reallocations. Avoid intermediate 3D object creation (like THREE.Vector3) inside coordinate loops.
