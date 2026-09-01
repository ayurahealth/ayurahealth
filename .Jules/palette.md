## 2024-08-13 - Chat Composer Accessibility
**Learning:** The ChatComposer and VoiceInput/Output components have icon-only buttons (like paperclip, link, microphone, voice listen/stop, etc.) without accessible `aria-label`s. `title` is used on some, but screen reader support for `title` is inconsistent, and explicit `aria-label`s are the standard for accessibility.
**Action:** Adding explicit `aria-label`s and `title` to these icon-only buttons makes them screen-reader accessible and improves overall keyboard navigation context. I will always verify icon buttons have ARIA labels.
