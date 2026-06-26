## 2026-06-26 - [WebGL Buffer Reallocation]
**Learning:** In @react-three/fiber, passing a new array reference to args like [new Float32Array(...)] inside <bufferAttribute> triggers costly WebGL buffer reallocation on every render.
**Action:** Fully memoize typed arrays and pass the stable reference to args to optimize rendering performance.
