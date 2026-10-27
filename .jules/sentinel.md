## 2026-09-11 - [CRITICAL] Fix Server-Side Request Forgery in URL fetching
**Vulnerability:** The `fetch-link` route accepted a `url` from the user and fetched it directly without checking if the hostname resolves to a private or internal IP (e.g., AWS metadata server `169.254.169.254` or `localhost`), allowing Server-Side Request Forgery (SSRF).
**Learning:** Always validate user-provided URLs against a private IP blacklist before making external network requests.
**Prevention:** Use manual redirect tracking and strict hostname validation (checking against private IP blocks) to prevent bypasses via redirects or URL encoding.
