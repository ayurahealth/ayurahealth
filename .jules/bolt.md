## 2026-06-08 - Optimize O(N x M) array lookups
**Learning:** In visualization components mapping large constant datasets against variable props, nested .find() operations cause O(N x M) efficiency drops.
**Action:** Pre-process arrays into a Record using useMemo to achieve O(N) lookup efficiency.
