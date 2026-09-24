## 2025-02-14 - SSRF in fetch-link route
**Vulnerability:** The `/api/fetch-link` endpoint took a user-provided URL and fetched it using a standard `fetch` call, which makes the server vulnerable to Server-Side Request Forgery (SSRF) and DNS rebinding attacks.
**Learning:** External links often need to be fetched, but the native `fetch` API doesn't prevent routing to internal IP addresses (like `127.0.0.1` or `169.254.169.254`).
**Prevention:** Implement and use a custom `fetchWithSSRFProtection` utility that resolves DNS records, checks for private IP ranges, and forces connection to the safe IP.
