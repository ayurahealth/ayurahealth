## 2024-05-18 - HolographicLabMap Render Bottleneck
**Learning:** In visualization components (`HolographicLabMap.tsx`) mapping a constant large dataset against variable props (`results`), nesting `.find()` inside a `.map()` during render creates an O(N * M) lookup.
**Action:** Always pre-process the variable array into a `Map` or `Record` using `useMemo` to achieve O(1) retrieval per node, reducing total render complexity to O(N + M).
