## 2026-05-30 - Optimize O(N x M) Lookups in React 3D Render Loops
**Learning:** In 3D visualization components mapping large constant datasets against variable props, using nested `.find()` operations inside loop-rendered objects introduces an O(N x M) bottleneck, causing severe performance penalties during each prop update.
**Action:** Pre-process variable arrays into an O(1) `Map` or `Record` lookup using `useMemo` to maintain high frame rates in render-heavy 3D scenes.
