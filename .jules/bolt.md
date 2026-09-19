## 2024-05-24 - Initial Review
**Learning:** Found no memoized components yet. Need to see if there is a component rendering heavily that we can memoize. MessageItem is rendered inside ChatMessagesPanel inside ChatInterface inside page.tsx. When input changes or streaming updates, does ChatMessagesPanel or MessageItem re-render?
**Action:** Let's look closer at ChatInterface.tsx and how it passes props down to ChatMessagesPanel and MessageItem. If input state is in ChatPage and ChatInterface re-renders on input typing, maybe MessageItem gets re-rendered a lot.
## 2024-05-24 - Investigating MessageItem
**Learning:** `MessageItem` inside `ChatMessagesPanel` is not memoized. When `ChatPage` rerenders due to streaming updates (the `streaming` state in `useChat`), the `messages` array itself might be stable but `ChatMessagesPanel` receives `streaming` so it rerenders entirely, which will cause every `MessageItem` in the list to rerender, even the ones that haven't changed!
**Action:** Adding `React.memo` to `MessageItem` and `ChatMessagesPanel` could save many re-renders during the streaming phase, which is a big performance bottleneck in chat applications.

## 2024-05-24 - Optimizing Chat Streaming Performance
**Learning:** Found that `MessageItem` and `ChatMessagesPanel` do not use `React.memo`. In a streaming chat UI, updating the `streaming` state constantly forces re-renders of the parent components, cascading down to all `MessageItem` components, even though the historic messages haven't changed.
**Action:** Adding `React.memo` to `MessageItem` will prevent unnecessary re-renders of all previous messages during active stream. I will implement this for a solid performance boost.
