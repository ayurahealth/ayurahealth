
## 2026-10-23 - [CRITICAL] Fix Insecure Direct Object Reference (IDOR)
**Vulnerability:** The GET endpoint in `app/api/chat/history/route.ts` fetched chat sessions using a `userId` query parameter without checking if the authenticated user matched that ID, leading to an IDOR vulnerability.
**Learning:** Next.js App Router API endpoints do not enforce global authorization middleware. To prevent IDOR vulnerabilities when authenticating with Clerk, manually use `await auth()` from `@clerk/nextjs/server` in each endpoint to retrieve the authenticated user's ID (`authUserId`) and validate any client-provided user IDs against it before returning sensitive data.
**Prevention:** Always validate client-provided user IDs against the authenticated user's ID obtained from `await auth()` before performing database queries or returning sensitive data.
