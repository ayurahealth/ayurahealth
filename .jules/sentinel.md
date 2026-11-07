## 2026-11-07 - [Fix SSRF vulnerability in fetch-link]
**Vulnerability:** Found a Server-Side Request Forgery (SSRF) vulnerability in `app/api/fetch-link/route.ts` where user-provided URLs were fetched without validation or DNS resolution checks against internal subnets.
**Learning:** Relying solely on `fetch` for external URLs can lead to SSRF and cloud metadata exfiltration or internal network reconnaissance if input validation and IP resolution are not strictly verified to block local networks (127.x.x.x, 10.x.x.x, etc.).
**Prevention:** Always validate protocols (http/https) and resolve domains to IP addresses to strictly block requests to the loopback subnet, private IPs, link-local addresses, and any non-external network IP spaces before issuing outbound requests.
