## 2025-05-24 - Accessible Chat Composer Controls
**Learning:** Found that core chat interface controls (attachment, link, mic, send) were missing crucial ARIA labels, making the primary interaction zone inaccessible to screen readers since they were icon-only buttons. The input area and link trace area also lacked ARIA labels.
**Action:** Always verify that interactive icon-only buttons and core input areas have explicit `aria-label` attributes and consider adding `title` for visual tooltips where appropriate to support all user navigation modalities.
