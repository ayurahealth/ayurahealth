## 2024-05-09 - Missing ARIA labels on icon buttons
**Learning:** Found several icon-only buttons throughout the app (especially in the ChatComposer) lacking aria-labels, making them inaccessible to screen readers. VoiceInput and VoiceOutput also lack aria-labels despite having titles.
**Action:** Always verify icon-only interactive elements contain both `title` and `aria-label` attributes to ensure keyboard and screen-reader accessibility.
