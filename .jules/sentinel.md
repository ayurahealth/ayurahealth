## 2025-02-28 - [Insecure Direct Object Reference (IDOR) in Chat History API]
**Vulnerability:** The GET `/api/chat/history` endpoint allowed fetching chat history using an arbitrary user ID provided via query string without verifying authorization.
**Learning:** Next.js App Router API endpoints do not enforce global authorization middleware. It is necessary to manually use `auth()` from `@clerk/nextjs/server` to fetch the authenticated user and validate any client-provided user IDs before returning sensitive data.
**Prevention:** Always authenticate the user within the API route itself and verify they own the data they are requesting, even if frontend routes are protected.
