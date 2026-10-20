## 2026-10-20 - IDOR in Chat History Endpoint
**Vulnerability:** The `app/api/chat/history/route.ts` endpoint accepted a `userId` from the query string without enforcing that the requested `userId` matched the currently authenticated user's ID, leading to an Insecure Direct Object Reference (IDOR) vulnerability.
**Learning:** Next.js App Router API endpoints do not enforce global authorization middleware. Relying on client-provided `userId`s without explicit validation against the `auth()` context in Next.js/Clerk is a critical risk.
**Prevention:** Always use `auth()` from `@clerk/nextjs/server` to retrieve the authenticated user's ID (`authUserId`) in each endpoint and validate any client-provided user IDs against it before returning sensitive data.
