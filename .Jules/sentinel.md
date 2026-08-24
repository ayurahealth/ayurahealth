## 2024-08-24 - SSRF in Fetch Link API
**Vulnerability:** The fetch-link API accepted any URL directly into a server-side fetch without validation, allowing Server-Side Request Forgery.
**Learning:** Unrestricted outbound fetch requests can expose internal network resources and metadata endpoints.
**Prevention:** Always parse and validate user-provided URLs before making server-side network requests.
