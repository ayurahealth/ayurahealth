## 2026-10-30 - [Insecure Direct Object Reference (IDOR) in API Endpoint]
**Vulnerability:** The `app/api/chat/history/route.ts` endpoint accepted a `userId` parameter without verifying it matched the authenticated user's ID, allowing any user to read others' chat history.
**Learning:** Next.js App Router API routes do not automatically enforce authorization for specific parameters. Relying solely on client-provided IDs without server-side validation against the authenticated session leads to IDOR.
**Prevention:** Always use `await auth()` from `@clerk/nextjs/server` inside the API route to retrieve the `authUserId` and explicitly validate it against any requested user IDs before querying sensitive data.
