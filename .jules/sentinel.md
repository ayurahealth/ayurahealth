## 2026-09-27 - Server-Side Request Forgery in fetch-link route
**Vulnerability:** The `/api/fetch-link` route accepted a user-provided URL and fetched it blindly, allowing attackers to probe internal services and loopback addresses.
**Learning:** Native `fetch()` is vulnerable to SSRF. Simply substituting the hostname with a DNS-resolved IP breaks TLS Server Name Indication (SNI) and the HTTP Host header.
**Prevention:** Implement a custom `http`/`https` client wrapper (`fetchWithSSRFProtection`) that performs DNS lookup, validates against private IPs, and establishes the connection using the validated IP while preserving the original hostname in `servername` (SNI) and `Host` headers to prevent TOCTOU DNS rebinding.
