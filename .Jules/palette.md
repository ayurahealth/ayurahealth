## 2026-08-14 - Accessible Icon-Only Buttons in Chat Composer
**Learning:** Icon-only buttons (like attachment, microphone, and send buttons) in `components/chat/ChatComposer.tsx` were missing accessible names, rendering them invisible or confusing to screen reader users and missing hover tooltips for mouse users.
**Action:** Always verify that interactive elements lacking visible text have explicitly defined `aria-label` and `title` attributes to maintain accessibility and clear UX for all input methods.
