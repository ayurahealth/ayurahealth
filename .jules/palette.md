## 2025-02-23 - Accessibility check on icon-only buttons
**Learning:** Found an accessibility issue pattern across the application where various icon-only buttons (like those in VoiceInput, VoiceOutput, and ChatComposer components) lacked `aria-label` attributes. While some had `title` attributes, both are necessary to ensure full support for all screen readers.
**Action:** Always verify that interactive elements relying purely on icons include both a descriptive `aria-label` and `title` to maintain screen reader accessibility without relying exclusively on tooltips.
