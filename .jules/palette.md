## 2026-09-23 - Missing ARIA Labels on Icon Buttons
**Learning:** Found several icon-only buttons (like the modal close button with `<X size={20} />` in `app/dashboard/dashboard-content.tsx` and history button in `app/chat/components/ChatInterface.tsx`) that lack an `aria-label`. This makes it difficult for screen reader users to understand the button's purpose.
**Action:** Always add an `aria-label` to buttons that only contain icons.
