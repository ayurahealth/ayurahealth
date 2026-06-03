## 2026-06-03 - Optimize O(N x M) nested array lookup in HolographicLabMap
**Learning:** In visualization components that map a large constant dataset against variable props, using nested `.find()` operations results in O(N x M) complexity.
**Action:** Pre-process arrays into a Map or Record using `useMemo` to achieve O(N) lookup efficiency.
