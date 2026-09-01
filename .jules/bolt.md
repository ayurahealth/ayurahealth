## 2026-06-25 - Prevent WebGL Buffer Reallocations in R3F
**Learning:** In `@react-three/fiber`, passing a new array reference like `[new Float32Array(...), 3]` to a `<bufferAttribute>`'s `args` prop triggers a costly WebGL buffer reallocation on every render.
**Action:** Always fully memoize the `args` array, including the `Float32Array` itself, using `useMemo` to pass a stable reference to `args`.
