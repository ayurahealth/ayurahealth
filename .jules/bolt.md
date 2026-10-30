## 2024-05-27 - [WebGL Buffer Attribute Memoization]
**Learning:** In @react-three/fiber, passing a new array reference to args (e.g., [new Float32Array(...)]) inside <bufferAttribute> triggers costly WebGL buffer reallocation on every render.
**Action:** Fully memoize typed arrays and pass the stable reference to args.
