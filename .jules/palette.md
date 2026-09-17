## 2024-03-20 - Accessible Chat Composer Buttons
**Learning:** Found several icon-only buttons in `ChatComposer.tsx` (remove attachment, add attachment, add link, voice input, send message) that lack `aria-label` attributes. This is a common accessibility issue that prevents screen readers from announcing the button's purpose.
**Action:** Adding `aria-label` or `title` to these icon-only buttons to ensure they are accessible. Will include tooltip via title for sighted keyboard users.
