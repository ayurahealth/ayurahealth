## 2026-07-06 - Prevent WebGL Buffer Reallocation in R3F
**Learning:** In @react-three/fiber, passing a new array reference to the `args` prop of `<bufferAttribute>` triggers costly WebGL buffer reallocations on every render.
**Action:** Always fully memoize typed arrays and pass the stable reference to `args` to preserve object reference equality and prevent performance degradation.
