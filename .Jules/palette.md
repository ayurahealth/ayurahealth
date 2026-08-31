## 2024-05-14 - ChatComposer Icon Buttons and SystemCard A11y
**Learning:** Found several icon-only buttons in `components/chat/ChatComposer.tsx` (attachment, link, voice, send) and stateful buttons in `components/ui/SystemCard.tsx` that lacked essential ARIA attributes and tooltips, which makes them inaccessible to screen readers and difficult to understand for users.
**Action:** Always add `aria-label`, `title`, and appropriate state attributes like `aria-expanded` and `aria-pressed` to icon-only buttons to ensure they are fully accessible and provide tooltips.
