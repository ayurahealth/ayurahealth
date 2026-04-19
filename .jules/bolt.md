
## 2026-04-19 - [Preventing Expensive Message Re-renders]
**Learning:** Re-rendering past chat messages (especially those with heavy formatting like `ReactMarkdown`) on every streaming tick or keystroke is a major performance anti-pattern. Next.js App Router does not memoize client components by default.
**Action:** Always wrap list items in `React.memo` and use stable callbacks (`useCallback`) for event handlers passed as props to avoid triggering complete re-renders of the entire message history on every stream update.
