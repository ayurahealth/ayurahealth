## 2024-05-07 - O(N x M) Lookups in 3D Visualizations
**Learning:** In heavily rendered 3D visualization components like `HolographicLabMap`, using `.find()` inside the render loop for large constant datasets causes O(N x M) performance bottlenecks, severely impacting frame rates.
**Action:** Pre-process variable props (like `results`) into a `Map` or `Record` using `useMemo` to convert O(N x M) nested lookups into O(N) operations.
