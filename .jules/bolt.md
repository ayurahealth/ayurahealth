## 2025-02-18 - React.memo() Performance Optimization
**Learning:** Next.js App Router client components need `React.memo` and `useCallback` for heavy list items like Markdown-rendering chat messages. Streaming updates or typing will cause expensive full-list re-renders if list items and their event handlers aren't properly memoized.
**Action:** When working with streaming data or frequent state updates in list items, wrap the item component in `React.memo()` and use `useCallback()` to memoize any event handler props passed to it, especially inline functions like `() => {}` inside props.
