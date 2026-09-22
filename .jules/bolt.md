## 2025-02-18 - ReactMarkdown Re-render Optimization
**Learning:** `ClinicalMarkdown.tsx` passes a fresh `components` object on every render to `<ReactMarkdown>`. This causes all custom Markdown elements to be unmounted and remounted during typing/streaming, tanking chat UI performance because `<ReactMarkdown>` uses strict equality for the `components` prop.
**Action:** Always `useMemo` the `components` object passed to `react-markdown` to prevent expensive re-renders and remounts of text nodes.
