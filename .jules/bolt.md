## 2025-02-23 - Optimizing Markdown Rendering
**Learning:** Using an inline object for the `components` prop in `react-markdown` causes React to completely unmount and remount the markdown DOM tree on every parent component re-render due to referential inequality of the object. This becomes a significant bottleneck in a chat interface rendering clinical reports.
**Action:** Always extract the `components` map into a `useMemo` hook (or define it outside the component if it has no dependencies) to maintain referential equality and optimize rendering performance when using `react-markdown`.
