## 2024-05-18 - Optimize HolographicLabMap lookups
**Learning:** In visualization components mapping constant dataset (e.g. `BIOMARKER_MAP`) against variable props (e.g. `results`), $O(N \times M)$ nested array `.find()` inside React element mapping loop can be heavily detrimental to rendering performance on each frame or data update.
**Action:** Always pre-process result arrays into a `Map` or `Record` object using `useMemo` for constant time $O(1)$ lookup before iterating over the main constant dataset during mapping.
