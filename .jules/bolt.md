## 2026-03-05 - [MessageItem React.memo optimization]
**Learning:** In a streaming chat interface, wrapping individual message items in React.memo is critical to prevent unnecessary re-renders of the entire message list.
**Action:** Use React.memo on list items that receive stable props or when parent components update frequently.
