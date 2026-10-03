## 2026-10-03 - SSRF Vulnerability in Link Fetcher
**Vulnerability:** The `/api/fetch-link` endpoint accepts a user-provided URL and fetches its contents using the native `fetch` API without any Server-Side Request Forgery (SSRF) protection.
**Learning:** This could allow an attacker to make requests to internal services, cloud metadata APIs, or loopback addresses from the perspective of the server. Native `fetch` does not offer built-in SSRF protection or IP blacklisting.
**Prevention:** Implemented a robust `fetchWithSSRFProtection` wrapper that resolves the hostname, verifies the IP against private/loopback CIDR blocks (including IPv4 and IPv6), and connects directly to the resolved IP to prevent DNS rebinding attacks while maintaining SNI and Host headers.
