## 2026-10-22 - SSRF via Unvalidated URL Fetch
**Vulnerability:** Server-Side Request Forgery (SSRF) in fetch-link API route allowing fetches to internal IP addresses (e.g., 169.254.169.254, 127.0.0.1).
**Learning:** Relying solely on the default fetch behavior without validating the resolved IP of user-supplied URLs exposes the internal network and metadata services.
**Prevention:** Always parse user-supplied URLs, resolve their domain using `dns.lookup`, and explicitly block loopback, private, and link-local subnets before fetching.
