## 2024-09-02 - Icon-Only Button Accessibility in Chat Composer
**Learning:** The Chat Composer component relies entirely on icon-only buttons (attach, link, voice, send, remove attachment) which lack accessible names. This completely hides core functionality from screen readers and lacks native tooltips for all users.
**Action:** Always ensure every icon-only button includes an `aria-label` for screen reader accessibility, and ideally a `title` attribute to provide a native tooltip for mouse users who may not immediately recognize the icon.
