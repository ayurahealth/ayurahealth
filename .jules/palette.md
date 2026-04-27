## 2026-04-27 - Found Missing ARIA Labels
**Learning:** The application uses many icon-only buttons (like those in `VoiceOutput.tsx` and `VoiceInput.tsx`) without proper `aria-label` attributes, though they sometimes have `title` attributes. This makes them inaccessible to screen readers which require an `aria-label` for icon-only interactive elements.
**Action:** Add `aria-label` to icon-only buttons to ensure they meet accessibility standards.
