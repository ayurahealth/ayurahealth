## 2026-05-27 - Optimize HolographicLabMap lookups
**Learning:** In visualization components that map a large constant dataset against variable props, using nested .find() operations creates an O(N x M) bottleneck. Pre-processing the variable props into a Map using useMemo resolves this.
**Action:** Use Map or Record and useMemo to achieve O(N) lookup efficiency for such patterns.
