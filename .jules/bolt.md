## 2026-09-23 - Memoize react-markdown components
**Learning:** Passing an inline object to the `components` prop in `react-markdown` causes React to recreate the object on every render, completely unmounting and remounting the markdown DOM tree. This is a critical performance bottleneck, particularly during streaming LLM responses where components re-render continuously.
**Action:** Extract the `components` map into a `useMemo` hook to maintain referential equality and optimize rendering, preventing unnecessary DOM thrashing.
