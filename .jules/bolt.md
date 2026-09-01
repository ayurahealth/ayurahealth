## 2026-01-01 - O(N x M) nested lookups in ThreeJS render loop
**Learning:** In visualization components like HolographicLabMap that map a large constant dataset against variable props, using array.find() within the render loop causes O(N x M) performance bottlenecks. This is especially problematic in WebGL/Three.js contexts where nodes might re-render frequently.
**Action:** Pre-process arrays into a Map or Record using useMemo to achieve O(N) lookup efficiency before mapping over large visualization datasets.
