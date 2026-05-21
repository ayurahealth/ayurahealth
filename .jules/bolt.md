## 2025-02-12 - Prevent nested lookup penalty in mapped visualization nodes
**Learning:** $O(N \times M)$ bottlenecks inside visualization mappings on arrays with changing variables such as hover states cause substantial continuous slowdowns from nested lookups (`find()` calls inside `map()` iterators for a set like `BIOMARKER_MAP`).
**Action:** Use pre-computed `Map` or `Record` hashes wrapped in `useMemo` to convert nested operations into independent $O(N)$ mappings that yield an $O(1)$ fast lookup during the active visualization loop renders to prevent unnecessary re-rendering hits.
