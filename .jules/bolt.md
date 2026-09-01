## 2024-05-16 - O(1) Hash Map Pre-processing for Visualization Components
**Learning:** In visualization components like HolographicLabMap that map a large constant dataset (e.g., `BIOMARKER_MAP`) against variable props (e.g., `results`), using nested `.find()` inside the mapping loop creates an O(N * M) performance bottleneck.
**Action:** Always pre-process variable arrays into a `Map` or `Record` using `useMemo` before rendering to achieve O(1) lookup efficiency when rendering mapped elements.
