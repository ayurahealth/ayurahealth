## 2026-06-05 - O(N*M) Lookup Optimization in HolographicLabMap
**Learning:** The HolographicLabMap component mapped a large constant dataset (BIOMARKER_MAP) against variable props (results) causing O(N*M) lookup times on every render via nested .find().
**Action:** Used useMemo to pre-process results into a lookup dictionary, achieving O(N) lookup efficiency for biomarker rendering.
