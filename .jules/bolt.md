## 2026-07-02 - [R3F BufferAttribute Reallocation]
**Learning:** Passing a new array reference (e.g., `[new Float32Array(...)]`) to the `args` prop of `<bufferAttribute>` in @react-three/fiber triggers costly WebGL buffer reallocations on every single render.
**Action:** Always fully memoize typed arrays and the `args` array itself using `useMemo` to pass a stable reference to `<bufferAttribute args={...}>`.
