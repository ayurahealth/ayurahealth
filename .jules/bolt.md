## 2024-05-24 - Visualization Component Render Bottlenecks
**Learning:** In 3D visualization components (like HolographicLabMap) that map large constant datasets against variable props, local state changes (e.g., pointer hover events) trigger expensive re-renders. Nested `.find()` operations inside these renders cause O(N × M) complexity, severely degrading frame rates during interactions.
**Action:** Pre-process arrays into a Map or Record using `useMemo` to achieve O(N) lookup efficiency, ensuring smooth 60fps rendering during hover and interaction states.
