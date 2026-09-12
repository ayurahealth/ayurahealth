## 2024-09-12 - Missing React.memo on Chat Message Items
**Learning:** In chat interfaces, `ChatMessagesPanel` re-renders frequently because of `messages` updates or typing indicators. Unmemoized `MessageItem` components will re-render unnecessarily on every parent render.
**Action:** Use `React.memo` for components like `MessageItem` that are mapped in long lists inside a chat panel to prevent heavy re-rendering when new messages arrive or when parent state updates.
