## 2024-05-24 - [Title]
**Vulnerability:** Found a Server-Side Request Forgery (SSRF) vulnerability in `app/api/fetch-link/route.ts` where user-provided URLs are directly passed to `fetch()` without any validation or sanitization.
**Learning:** This exists because the application needs to fetch metadata (title, text) from external links, but it trusts the client input implicitly. It allows attackers to make requests to internal IP addresses or sensitive local services on behalf of the server.
**Prevention:** Implement an SSRF protection utility that validates the hostname, resolves the IP address, and blocks private/loopback/bogon IP ranges before making the request.
