## 2024-03-24 - [IDOR in API Endpoint]
**Vulnerability:** The `/api/chat/history` endpoint accepts a `userId` parameter from the query string without verifying if it matches the authenticated user, allowing any user to read anyone's chat history.
**Learning:** In Next.js App Router, you must explicitly enforce authorization in each API route, especially when retrieving data based on user-supplied IDs.
**Prevention:** Always use `auth()` from `@clerk/nextjs/server` to get the authenticated user's ID, and either ignore the query parameter entirely or ensure it matches the authenticated user ID.
## 2024-03-24 - [SSRF in fetch-link]
**Vulnerability:** The /api/fetch-link endpoint fetches arbitrary user-provided URLs without verifying if they resolve to internal IP addresses, leading to a Server-Side Request Forgery (SSRF) vulnerability.
**Learning:** To prevent SSRF in Node.js/Next.js, relying on string matching against localhost is insufficient. We must resolve the domain to an IP address and block access to loopback and private subnets to mitigate DNS rebinding attacks.
**Prevention:** Always use dns.lookup to resolve hostnames before making outbound requests and explicitly block the entire loopback subnet and internal IP ranges.
