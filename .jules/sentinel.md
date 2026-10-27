## 2024-05-20 - SSRF Vulnerability in /api/fetch-link
**Vulnerability:** The /api/fetch-link route accepts a user-provided URL and fetches it without any SSRF (Server-Side Request Forgery) protection, allowing attackers to scan internal networks or access internal services.
**Learning:** External URL fetching always needs to be strictly validated to ensure it's not pointing to localhost, internal IPs, or cloud metadata endpoints.
**Prevention:** Always implement an SSRF protection utility that resolves the host to an IP and validates it against a list of allowed or blocked IP ranges, as well as enforcing timeouts.
