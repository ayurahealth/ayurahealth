## 2024-05-24 - SSRF in Link Fetcher
**Vulnerability:** Found a Server-Side Request Forgery (SSRF) risk in the link fetching route `app/api/fetch-link/route.ts` because it lacked URL validation before making requests, potentially allowing access to internal services.
**Learning:** Node.js backend needs to actively parse URLs and block internal or reserved loopback IP ranges rather than trusting any client-supplied URL for fetching text/metadata.
**Prevention:** Always parse URLs, resolve hostnames to IPs to prevent DNS rebinding, and explicitly block the entire loopback subnet (`127.0.0.0/8`, `::1`) when making outgoing proxy requests on behalf of users.
## 2024-05-24 - [CRITICAL] Prevent IDOR in chat history API
**Vulnerability:** IDOR (Insecure Direct Object Reference) in `app/api/chat/history/route.ts`. The endpoint accepted a `userId` parameter and fetched chat sessions for that user without verifying if the authenticated user matches the requested ID. An attacker could view any user's chat history by passing their `userId`.
**Learning:** Next.js App Router API endpoints do not enforce global authorization middleware for specific user resources by default. We must explicitly authorize access by fetching the authenticated user context (e.g., using `auth()` from Clerk) and validating it against the requested resource's owner.
**Prevention:** Always validate client-provided user IDs against the authenticated user's ID (`authUserId`) in API endpoints before querying or returning sensitive user-specific data.
