## 2024-09-12 - Added React.memo to MessageItem
**Learning:** In a chat interface with real-time streaming, rendering a list of messages without memoization causes the entire list to re-render for every character streamed in `ChatMessagesPanel`. This is a classic React performance bottleneck, especially as the chat history grows.
**Action:** When mapping over items in a frequently updated list (like chat messages or live logs), always wrap the individual item component in `React.memo` to prevent unnecessary re-renders.
