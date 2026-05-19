## 2024-05-15 - O(N x M) Nested Lookup Performance Anti-Pattern
**Learning:** In visualization components like HolographicLabMap that map a large constant dataset (e.g., BIOMARKER_MAP) against variable props (e.g., results), doing a nested `.find()` on the results array for every item in the dataset creates an O(N x M) nested lookup bottleneck.
**Action:** Always pre-process the variable array into a Map or Record using `useMemo` to achieve O(N) lookup efficiency, changing the total time complexity from O(N x M) to O(N + M).
