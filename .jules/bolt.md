## 2024-05-24 - O(N x M) find operation in Render Loops
**Learning:** Avoid nested array lookups (e.g. `array.find()`) inside rendering loops or maps over large constant datasets, as it introduces an O(N x M) performance bottleneck.
**Action:** Use `useMemo` to pre-process arrays into a `Record` or `Map` to achieve O(N) lookup efficiency within rendering maps.
