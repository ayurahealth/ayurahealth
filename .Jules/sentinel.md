## 2025-02-14 - IDOR in Chat History API
**Vulnerability:** The `/api/chat/history` endpoint allowed fetching chat history by simply providing any `userId` in the query parameter (`?userId=...`), exposing an Insecure Direct Object Reference (IDOR) vulnerability.
**Learning:** The endpoint trusted user input for authorization instead of relying on the server-side authentication context (Clerk's `currentUser()`).
**Prevention:** Always use secure, server-side session/authentication context (like `currentUser()`) for data fetching endpoints instead of trusting client-provided IDs.
