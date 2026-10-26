## 2024-10-26 - [IDOR in Next.js API Routes]
**Vulnerability:** IDOR in /api/chat/history where anyone could fetch another user's chat history.
**Learning:** Next.js App Router API endpoints do not enforce global authorization middleware for everything, so route handlers must manually validate user IDs.
**Prevention:** Use `await auth()` from `@clerk/nextjs/server` in each endpoint to retrieve the authenticated user's ID and validate any client-provided user IDs against it.
