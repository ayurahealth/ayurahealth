## 2024-05-27 - [Optimize ReactMarkdown Components]
**Learning:** [When using `react-markdown` in this project, avoid passing an inline object to the `components` prop. This causes React to recreate the object on every render, completely unmounting and remounting the markdown DOM tree.]
**Action:** [Extract the `components` map into a `useMemo` hook or define it outside the component to maintain referential equality and optimize rendering.]
