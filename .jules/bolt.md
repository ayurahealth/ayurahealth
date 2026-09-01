## 2024-05-03 - Memoizing chat components
**Learning:** Next.js App Router client components that render lists, particularly heavy ones like Markdown chat messages, suffer from performance regressions during streaming or keystrokes if the child items and their props are not properly memoized.
**Action:** Always wrap list item components (like `MessageItem`) in `React.memo()` and ensure that function props passed down to them are wrapped in `useCallback` to prevent O(n) re-renders across the list.
