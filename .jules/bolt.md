## 2026-05-24 - Optimize dataset lookup in HolographicLabMap
**Learning:** In visualization components like HolographicLabMap that map a large constant dataset against variable props, nested .find() operations cause O(N x M) complexity.
**Action:** Pre-process arrays into a Record or Map using useMemo to achieve O(N) lookup efficiency.
