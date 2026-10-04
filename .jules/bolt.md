
## 2024-10-04 - ReactMarkdown Inline Objects
**Learning:** Passing an inline object to the `components` prop in `react-markdown` causes React to recreate the object on every render, completely unmounting and remounting the markdown DOM tree. This is a significant performance bottleneck for chat interfaces where markdown content updates frequently during streaming.
**Action:** Extract the `components` map into a `useMemo` hook or define it outside the component to maintain referential equality and optimize rendering. Type `children` as `{ children?: React.ReactNode }` to avoid linting errors.
