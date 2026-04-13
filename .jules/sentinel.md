## 2026-04-13 - Fixed XSS vulnerability in markdown rendering
**Vulnerability:** XSS injection via markdown rendering into dangerouslySetInnerHTML
**Learning:** React components used `dangerouslySetInnerHTML` directly with unsanitized markdown rendering outputs. When using Next.js app router, ensure server-side rendering support is available. `dompurify` itself does not have native SSR support out of the box, `isomorphic-dompurify` must be used instead.
**Prevention:** Sanitize html via `isomorphic-dompurify` when rendering raw HTML in React components.
