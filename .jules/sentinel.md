## 2024-05-18 - SSRF in Link Fetcher
**Vulnerability:** Found a Server-Side Request Forgery (SSRF) vulnerability in `app/api/fetch-link/route.ts` where user-provided URLs are directly fetched without validation, allowing access to internal resources (e.g., localhost, internal networks).
**Learning:** Directly passing user-provided URLs to `fetch()` in Node.js server environments enables SSRF, even if it's meant to be a simple preview feature.
**Prevention:** Always validate the URL format and explicitly resolve and block internal IP addresses (loopback, private subnets, link-local) before executing the request on the server.
