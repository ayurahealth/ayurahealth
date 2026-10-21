## 2026-10-21 - IDOR in API Route
**Vulnerability:** Found an IDOR vulnerability in the chat history API route.
**Learning:** Next.js App Router API endpoints do not enforce global authorization middleware by default, leading to missing auth checks when relying on user-provided IDs.
**Prevention:** Manually use `auth()` from Clerk in each endpoint to validate client-provided user IDs against the authenticated user.
