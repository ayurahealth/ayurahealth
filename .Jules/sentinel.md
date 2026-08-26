## 2026-04-16 - Prevent Insecure Direct Object Reference (IDOR) on Chat History
**Vulnerability:** The `/api/chat/history` endpoint allowed any user (or unauthenticated user) to fetch any other user's chat history by simply providing their `userId` in the query parameter, leading to an IDOR vulnerability.
**Learning:** Next.js API routes must explicitly verify that the authenticated session ID matches the requested resource ID when fetching user-specific data. Relying purely on middleware may not cover all direct API accesses.
**Prevention:** Always extract `userId` from `@clerk/nextjs/server`'s `auth()` within the API route itself and validate it against the requested entity before querying the database.
