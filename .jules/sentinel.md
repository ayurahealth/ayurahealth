## 2024-11-05 - [API Route IDOR Missing Global Middleware]
**Vulnerability:** IDOR in chat history API endpoint allowing any user to fetch others' chat logs by modifying the userId query parameter.
**Learning:** Next.js App Router API endpoints do not enforce the global authorization middleware automatically. Authenticated routes must explicitly call `await auth()` locally.
**Prevention:** Manually call `await auth()` from `@clerk/nextjs/server` and validate the `userId` in every protected endpoint.
