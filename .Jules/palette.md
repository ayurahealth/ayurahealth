## 2024-08-25 - ARIA Labels on Voice Buttons
**Learning:** The `VoiceInput` and `VoiceOutput` components had icon-only buttons that relied solely on the `title` attribute for accessibility. `title` is often ignored by screen readers or poorly supported on mobile devices.
**Action:** Added `aria-label` and `aria-pressed` to ensure screen readers explicitly announce the button's purpose and its current toggle state.
