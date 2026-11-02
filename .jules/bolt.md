## 2026-11-02 - [React.memo for Streaming Chat Elements]
**Learning:** Chat streaming causes parent re-renders that needlessly rerender all previous messages and grid elements. Wrapping heavy child components like `MessageItem` and `SystemCard` in `React.memo` is critical to prevent O(N^2) render performance during SSE streaming.
**Action:** Always memoize list items in a streaming/live-updating UI to isolate render loops.
