## 2026-09-25 - Extracted static objects from ReactMarkdown
**Learning:** Passing inline objects or arrays to `ReactMarkdown` props causes complete DOM remounting. While `useMemo` solves it, static extraction outside the component is better for performance when props aren't dynamic.
**Action:** Always extract static config objects (like `remarkPlugins` and `components` in `react-markdown`) outside the component body to avoid unnecessary hook usage.
