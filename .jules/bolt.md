## 2025-01-20 - Memoizing Heavy Chat Message Components
**Learning:** In Next.js App Router client components, list items (especially heavy components like chat messages rendering Markdown) must be wrapped in `React.memo` and their event handler props memoized with `useCallback` to prevent expensive full-list re-renders on streaming updates or keystrokes.
**Action:** Wrap `MessageItem` in `React.memo` and memoize `onSpeakText` and `onSelectSource` with `useCallback` to maintain stability during streaming.
