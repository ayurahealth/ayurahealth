## 2025-02-18 - Optimized HolographicLabMap lookups
**Learning:** In visualization components like HolographicLabMap.tsx that map a large constant dataset against variable props, using `.find()` inside the `.map()` loop leads to $O(N \times M)$ complexity.
**Action:** Always pre-process the variable array into a `Record` or `Map` using `useMemo` to achieve $O(N)$ lookup efficiency before mapping over the constant dataset.
