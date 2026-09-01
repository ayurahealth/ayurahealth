## 2024-05-23 - React Three Fiber Buffer Reallocations
**Learning:** In @react-three/fiber, passing a new array reference to args (e.g., [new Float32Array(...)]) inside <bufferAttribute> triggers costly WebGL buffer reallocation on every render.
**Action:** Fully memoize typed arrays and pass the stable reference to args to optimize rendering performance.
