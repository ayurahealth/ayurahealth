## 2024-05-24 - Optimization Pattern
**Learning:** In visualization components that map a large constant dataset against variable props, O(N x M) nested find operations inside render loops can cause performance degradation.
**Action:** Pre-process arrays into a Record or Map using useMemo to achieve O(1) lookup efficiency for variable props.
