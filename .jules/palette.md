## 2026-09-14 - Add ARIA Labels to ChatComposer Icon Buttons
**Learning:** Critical chat composition actions (attach, link, voice, send) were implemented as icon-only buttons without accessible names, making the core feature inaccessible to screen readers.
**Action:** Always provide `aria-label` or visually hidden text for icon-only buttons, especially in complex interfaces like chat composers.
