## 2024-05-18 - SSRF in Link Fetcher
**Vulnerability:** Found a Server-Side Request Forgery (SSRF) vulnerability in `app/api/fetch-link/route.ts` where user-provided URLs are directly fetched without validation, allowing access to internal resources (e.g., localhost, internal networks).
**Learning:** Directly passing user-provided URLs to `fetch()` in Node.js server environments enables SSRF, even if it's meant to be a simple preview feature.
**Prevention:** Always validate the URL format and explicitly resolve and block internal IP addresses (loopback, private subnets, link-local) before executing the request on the server.
## 2026-11-08 - SSRF via DNS Rebinding
**Vulnerability:** The SSRF mitigation using `dns.lookup` was vulnerable to DNS rebinding because the subsequent `fetch()` performed a second DNS resolution, allowing an attacker to return a safe IP first and an internal IP second.
**Learning:** Checking a hostname's IP and then fetching the hostname creates a TOCTOU (Time-of-Check to Time-of-Use) vulnerability.
**Prevention:** To safely fetch a user-provided URL, resolve the IP, validate it against internal ranges, and then force the HTTP client to connect directly to that validated IP (by overriding the hostname in the URL) while preserving the original `Host` header.
