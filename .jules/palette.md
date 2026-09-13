## 2024-05-24 - Accessibility (ARIA labels)
**Learning:** Found several icon-only buttons in `components/chat/ChatComposer.tsx` (like the attachment button, link trace, mic button, and send button) missing ARIA labels. This is a common accessibility issue for screen readers.
**Action:** Adding explicit `aria-label` and `title` attributes to all icon-only interactive elements across the chat interface, improving assistive technology support for core application features.
