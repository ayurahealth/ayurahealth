## 2024-05-24 - HolographicLabMap Optimization
**Learning:** Passing new array references to React Three Fiber buffer attributes triggers costly WebGL buffer reallocations.
**Action:** Memoize typed arrays and push primitive coordinates to avoid intermediate object allocation.
