## 2024-10-07 - IDOR in Next.js App Router API
**Vulnerability:** Found an IDOR vulnerability in the `/app/api/chat/history/route.ts` API endpoint where user input `userId` was used to retrieve chat history without authorization validation.
**Learning:** Next.js App Router API endpoints do not enforce global authorization middleware.
**Prevention:** Explicitly use `auth()` from `@clerk/nextjs/server` in each endpoint to retrieve the authenticated user's ID (`authUserId`) and validate any client-provided user IDs against it before returning sensitive data. Ensure to `await auth()` in Next.js 15+ / Clerk v7+.
