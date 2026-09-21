## 2026-09-21 - Memoize MessageItem
**Learning:** In highly interactive React chat applications with complex message components (like Markdown rendering and animations), updating global state (like input value or speaking status) triggers a cascade of re-renders for all historic messages. Wrapping the list item component (`MessageItem`) in `React.memo` successfully prevents these costly re-renders, dramatically improving list performance.
**Action:** Always consider memoizing complex items rendered in long lists if their props rarely change after initial insertion.
