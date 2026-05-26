## 2024-05-24 - Pre-processing constant datasets
**Learning:** In visualization components like `HolographicLabMap.tsx` that map a large constant dataset against variable props, O(N * M) nested `.find()` operations can cause performance issues.
**Action:** Pre-process arrays into a `Map` or `Record` using `useMemo` to achieve O(N) lookup efficiency.
