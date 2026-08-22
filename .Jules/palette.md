## 2024-05-24 - Missing ARIA Labels on Icon-only Buttons
**Learning:** Multiple interactive icon-only buttons in complex components like `ChatComposer` often lack `aria-label`s, which severely degrades the experience for screen reader users by not communicating the button's purpose.
**Action:** Systematically check all buttons that only contain icons (like X, Paperclip, Link, Mic, etc.) across the app and ensure they have descriptive `aria-label` attributes.
