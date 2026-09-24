## 2024-09-24 - ReactMarkdown Render Optimization
**Learning:** In this Next.js app, using an inline object for the `components` prop in `<ReactMarkdown>` forces React to completely unmount and remount the markdown DOM tree on every render, severely impacting performance during message streaming.
**Action:** Extract the `components` mapping outside the component or memoize it using `useMemo` to maintain referential equality across renders, significantly improving streaming performance.
