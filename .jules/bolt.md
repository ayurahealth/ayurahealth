## 2026-06-21 - Optimize R3F WebGL buffer reallocation in HolographicLabMap
**Learning:** In `@react-three/fiber`, passing a new array to `args` like `new Float32Array()` inside `bufferAttribute` causes complete buffer reallocation on every render. In `HolographicLabMap.tsx`, this occurred on every hover state change, destroying GPU performance.
**Action:** Always fully memoize typed arrays (e.g., `Float32Array`) used in R3F geometry attributes and pass the memoized reference to `args`.
