## 2024-05-18 - SSRF Vulnerability in Link Fetcher
**Vulnerability:** Found a Server-Side Request Forgery (SSRF) vulnerability in `app/api/fetch-link/route.ts` where user-provided URLs are passed directly to `fetch()` without any validation or sanitization.
**Learning:** The application uses `fetch()` to fetch link titles and content. This can be exploited to bypass firewalls, access internal services, read sensitive metadata, or conduct port scanning by passing URLs like `http://localhost:3000`, `http://169.254.169.254`, etc.
**Prevention:** Use a custom `fetchWithSSRFProtection` utility to validate URLs and prevent accessing private IP addresses.
