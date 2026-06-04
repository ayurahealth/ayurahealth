## 2026-06-04 - O(N x M) Lookup in HolographicLabMap
**Learning:** In visualization components that map a large constant dataset against variable props, using `.find()` inside the render loop causes an O(N x M) bottleneck.
**Action:** Pre-process arrays into a Map or Record using useMemo to achieve O(N) lookup efficiency.
