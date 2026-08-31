## 2024-05-18 - Fix IDOR in Chat History
**Vulnerability:** Missing authorization check on `/api/chat/history` endpoint, allowing any user to fetch another user's chat history by modifying the `userId` query parameter.
**Learning:** Even if an API endpoint expects a `userId` query parameter, it is crucial to verify that the requested `userId` matches the ID of the currently authenticated user to prevent Insecure Direct Object References (IDOR).
**Prevention:** Always authenticate the user on the server side using `auth()` (or equivalent) and ensure that the requested resource belongs to them before returning it.
