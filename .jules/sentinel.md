## 2024-05-24 - Missing Authorization on Clinical History API
**Vulnerability:** The `/api/chat/history` endpoint allowed fetching any user's chat sessions by simply providing their `userId` in the query parameters (Insecure Direct Object Reference).
**Learning:** Endpoints that accept a user identifier as a parameter must explicitly verify that the currently authenticated user matches that identifier.
**Prevention:** Always use `@clerk/nextjs/server`'s `currentUser()` (or equivalent auth context) to validate ownership before querying sensitive data.
