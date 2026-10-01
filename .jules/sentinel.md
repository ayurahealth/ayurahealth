## 2024-05-24 - [Fix SSRF in Link Fetcher]
**Vulnerability:** Server-Side Request Forgery (SSRF) in `/api/fetch-link` endpoint, where user-provided URLs were fetched directly using native `fetch()` without validating the resolved IP against private networks.
**Learning:** Native `fetch()` resolves hostnames automatically and blindly connects to the resulting IP, even if it's internal. Validating just the hostname before calling `fetch()` is insufficient due to DNS rebinding (TOCTOU).
**Prevention:** Use a custom fetch wrapper (`fetchWithSSRFProtection`) that performs `dns.lookup`, verifies the IP isn't internal/private, and then uses Node's `http.request` to connect directly to that IP while preserving the original `Host`/SNI headers. Ensure 0.0.0.0 and IPv6 ULAs are explicitly blocked.
