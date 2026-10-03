## 2024-10-03 - React-Markdown Full Remount cycles
**Learning:** Passing an inline object to the `components` prop of `react-markdown` causes React to recreate the object on every render. This leads to the entire markdown DOM tree completely unmounting and remounting on every render, which is a massive performance bottleneck, especially for heavy text-based components.
**Action:** Always extract the `components` map passed to `react-markdown` into a `useMemo` hook (or define it outside the component if it doesn't depend on props/state) to maintain referential equality and optimize rendering.
