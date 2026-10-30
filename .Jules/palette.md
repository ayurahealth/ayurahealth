## 2024-08-17 - Add ARIA Labels to Icon-Only Buttons in ChatComposer
**Learning:** Found that the primary chat interface (ChatComposer) had multiple icon-only buttons (attachments, link, microphone, send) lacking accessible names. Since this is the core interaction point for the application, ensuring screen reader users can identify these actions is critical for the app's overall accessibility.
**Action:** Always verify icon-only buttons have descriptive `aria-label` or `title` attributes, especially in high-traffic components like chat interfaces.
