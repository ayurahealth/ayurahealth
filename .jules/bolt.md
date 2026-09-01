## 2026-06-07 - Pre-processing constant datasets against variable props
**Learning:** In visualization components like HolographicLabMap.tsx that map a large constant dataset against variable props, using nested .find() operations inside a map causes O(N x M) complexity.
**Action:** Use useMemo to pre-process the variable array into a Record/Map to achieve O(N) lookup efficiency during render.
