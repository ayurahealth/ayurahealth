## 2024-05-23 - Prevent IDOR in API Routes
**Vulnerability:** The `/api/chat/history` endpoint did not validate if the requested `userId` matched the currently authenticated user, resulting in an Insecure Direct Object Reference (IDOR) vulnerability.
**Learning:** Next.js App Router API endpoints do not enforce global authorization middleware automatically for parameters. `userId` in queries can be easily manipulated.
**Prevention:** Always use `@clerk/nextjs/server`'s `auth()` method to verify the user identity (`authUserId`) and compare it against any user-provided identifiers before performing sensitive database queries.
