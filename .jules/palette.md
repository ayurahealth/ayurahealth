## 2026-06-24 - Dynamic Voice Interaction Buttons Accessibility
**Learning:** The application utilizes dynamic, icon-only buttons for voice interactions but relies solely on `title` attributes, making state changes invisible to screen readers.
**Action:** Always include dynamically updating `aria-label` and `aria-pressed` properties alongside `title` on interactive icon-only buttons to guarantee state changes are announced properly.
