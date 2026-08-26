## 2024-08-26 - Missing ARIA Labels on Chat Composer Utility Icons
**Learning:** Complex input composers often group utility actions (like attach, link, voice, send) as icon-only buttons to save space, but these frequently lack `aria-label` attributes, making them completely opaque to screen reader users in this app's core chat interface.
**Action:** Always ensure icon-only utility buttons within complex composer components are explicitly labeled with clear, actionable `aria-label`s.
