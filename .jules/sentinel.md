## 2026-09-12 - Critical IDOR in Chat History API
**Vulnerability:** Missing authorization in `/api/chat/history` allowed any user to fetch another user's clinical chat history by modifying the `userId` query parameter.
**Learning:** Next.js route handlers receiving user identifiers via query params or body must explicitly authorize that the authenticated user owns that identifier, rather than implicitly trusting the client input.
**Prevention:** Always use server-side authentication functions (e.g., `currentUser()`) as the source of truth for authorization checks and database queries, rather than relying on client-provided IDs.
