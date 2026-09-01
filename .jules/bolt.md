## 2026-07-04 - [Memoize WebGL Buffer Attributes]
**Learning:** In @react-three/fiber, passing a new array reference like `new Float32Array(...)` inline within `<bufferAttribute args={[...]}>` triggers costly WebGL buffer reallocations on every render.
**Action:** Always fully memoize typed arrays and pass a stable reference to `args` inside `<bufferAttribute>` to optimize rendering performance.
