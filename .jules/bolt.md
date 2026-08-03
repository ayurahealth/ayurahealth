## 2025-02-23 - WebGL Buffer Reallocation in React Three Fiber
**Learning:** Passing newly constructed arrays (e.g., `[new Float32Array(...)]`) directly to `args` inside a `<bufferAttribute>` component in React Three Fiber (R3F) causes costly WebGL buffer reallocations on every render, even if the array content is static.
**Action:** Always fully memoize the constructed TypedArray and the complete `args` array containing it when using `<bufferAttribute>` to ensure a stable reference and eliminate render-loop reallocation overhead.
