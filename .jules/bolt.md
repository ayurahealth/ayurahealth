## 2024-05-20 - O(N x M) Lookups in Visualization Components
**Learning:** In visualization components like `HolographicLabMap.tsx` that map a large constant dataset against variable props (e.g., results), using `.find()` inside the map loop creates an $O(N \times M)$ performance bottleneck.
**Action:** Always pre-process variable arrays into a `Map` or `Record` using `useMemo` before the mapping loop to achieve $O(N)$ efficiency.
