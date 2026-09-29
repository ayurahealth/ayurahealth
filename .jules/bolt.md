## 2026-09-29 - ReactMarkdown Re-render Optimization
**Learning:** Passing an inline object to the `components` prop of `react-markdown` in a React Server Component (or even Client Component) causes the object to be recreated on every render, which in turn causes the entire markdown DOM tree to be unmounted and remounted.
**Action:** Always extract the `components` object mapping for `react-markdown` outside of the component render function (or use `useMemo`) to maintain referential equality and avoid expensive DOM thrashing.
