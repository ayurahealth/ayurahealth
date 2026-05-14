## 2024-10-24 - HolographicLabMap O(N*M) Lookup Optimization
**Learning:** In visualization components like `HolographicLabMap.tsx` that map a large constant dataset (`BIOMARKER_MAP`) against variable props (`results`), nested `.find()` operations inside the map create an O(N * M) performance bottleneck that runs on every render.
**Action:** Avoid nested `.find()` operations by pre-processing arrays into a `Map` or `Record` using `useMemo` to achieve O(N) lookup efficiency before mapping over the constant dataset.
