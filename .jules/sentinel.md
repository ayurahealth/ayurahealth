## 2026-09-25 - Fix SSRF Vulnerability in URL Fetching
**Vulnerability:** Found an unauthenticated Server-Side Request Forgery (SSRF) vulnerability in `app/api/fetch-link/route.ts` where user-provided URLs were fetched directly using native `fetch()`, allowing internal network requests.
**Learning:** It's important to remember that any user-supplied URL fetching from the server must be strictly validated.
**Prevention:** Ensure that external URL fetching relies on a security utility like `fetchWithSSRFProtection` instead of using native HTTP client APIs.
