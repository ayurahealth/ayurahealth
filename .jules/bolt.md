## 2024-05-28 - HolographicLabMap O(N*M) Lookup Optimization
**Learning:** Visual components with large constant datasets mapping against variable props, like `HolographicLabMap` utilizing `BIOMARKER_MAP`, can experience performance bottlenecks due to O(N*M) nested `.find()` operations.
**Action:** Pre-process variable arrays into a `Record` or `Map` using `useMemo` for O(1) lookups inside the mapping loops, achieving overall O(N) efficiency and preventing redundant calculations during re-renders.
