## 2024-10-24 - HolographicLabMap Visualization Bottleneck
**Learning:** In visualization components like HolographicLabMap.tsx that map a large constant dataset (e.g., BIOMARKER_MAP) against variable props (e.g., results), using `.find()` inside a `.map()` loop creates an O(N x M) operation, which causes performance issues and frame drops in 3D renderings.
**Action:** Pre-process variable result arrays into a `Map` or `Record` using `useMemo` to achieve O(1) lookups during the render phase.
