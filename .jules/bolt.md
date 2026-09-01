## 2026-06-29 - Memoizing WebGL buffer attributes
**Learning:** In @react-three/fiber, passing a new array reference to `args` (e.g., `[new Float32Array(...)]`) inside `<bufferAttribute>` triggers costly WebGL buffer reallocation on every render.
**Action:** Always fully memoize typed arrays and pass the stable reference to `args` when working with buffer attributes to optimize rendering performance.
