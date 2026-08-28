## 2024-05-24 - Accessibility and Voice Interface
**Learning:** Found several icon-only buttons (like `VoiceInput`, `VoiceOutput`, and `ConsentBanner`) missing standard ARIA labels, which impairs accessibility for screen reader users relying on voice inputs. Also observed that tooltips/title attributes are not a direct replacement for aria-labels on icon buttons.
**Action:** Always verify icon-only buttons have an explicit `aria-label` attribute in addition to visual or title-based indicators. I'll add `aria-label` to these components.
