## 2026-06-27 - React-Three-Fiber Buffer Reallocation
**Learning:** In `@react-three/fiber`, passing a new array reference to `args` (e.g., `[new Float32Array(...)]`) inside `<bufferAttribute>` triggers costly WebGL buffer reallocation on every render.
**Action:** Fully memoize typed arrays within `useMemo` and pass the stable reference to `args` to prevent unnecessary buffer reallocations.
