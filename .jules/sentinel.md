## 2024-05-18 - [Fix SSRF vulnerability in fetch-link API endpoint]
**Vulnerability:** Found a Server-Side Request Forgery (SSRF) vulnerability in `/api/fetch-link` where user-provided URLs were fetched without validation, allowing access to internal resources (e.g., localhost, internal networks).
**Learning:** Client-provided URLs must be validated before making requests to prevent attackers from using the server as a proxy to access internal or restricted resources.
**Prevention:** Implement strict URL validation, including domain resolution and checking against private/loopback IP address ranges, before calling `fetch` on user-provided URLs.
