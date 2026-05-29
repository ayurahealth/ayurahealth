## 2026-05-29 - Optimize HolographicLabMap lookups
**Learning:** In visualization components that map a large constant dataset against variable props, nested .find() operations cause O(N x M) rendering bottlenecks.
**Action:** Pre-process arrays into a Map or Record using useMemo to achieve O(N) lookup efficiency in renders.
