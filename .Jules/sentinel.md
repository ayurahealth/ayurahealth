## 2025-02-27 - SSRF Vulnerability in Link Fetcher
**Vulnerability:** The `/api/fetch-link` endpoint directly fetched user-provided URLs without validation, allowing Server-Side Request Forgery (SSRF) against internal services and AWS metadata endpoints (169.254.169.254).
**Learning:** Next.js API routes that proxy content must rigorously validate and sanitize destination URLs, explicitly blocking private/local IP ranges and non-HTTP protocols, as they execute within the internal cloud environment.
**Prevention:** Always use a strict URL parsing and filtering function before passing user-supplied input to `fetch()`, blocking local networks, loopback addresses, and non-standard protocols.
