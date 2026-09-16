
## 2026-09-16 - SSRF in Next.js Server Side Fetch
**Vulnerability:** Found a Server-Side Request Forgery (SSRF) vulnerability in `app/api/fetch-link/route.ts` where user-provided URLs were directly fetched using the native `fetch` API without IP resolution validation, allowing requests to internal network addresses.
**Learning:** Using native `fetch` with external user input is inherently dangerous because it transparently resolves and follows DNS, opening up TOCTOU (Time-of-check to time-of-use) vulnerabilities if DNS checks and actual HTTP requests are not atomic.
**Prevention:** Implemented a custom `fetchWithSSRFProtection` wrapper using Node's `http/https` modules that first manually resolves the DNS and checks the IP against private subnets (e.g., 127.0.0.1, 10.x.x.x) before creating the HTTP request directly to the safe IP, passing the original domain via the `Host` header to preserve SNI.
