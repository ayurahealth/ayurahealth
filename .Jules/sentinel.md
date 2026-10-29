## 2024-10-29 - [Missing Global Auth Middleware]
**Vulnerability:** Found an Insecure Direct Object Reference (IDOR) vulnerability in `app/api/chat/history/route.ts` where any user's chat history could be retrieved by passing their `userId` in the query parameters.
**Learning:** In this Next.js application, App Router API endpoints do not enforce global authorization middleware. Endpoints are entirely unauthenticated by default unless explicitly protected.
**Prevention:** Always manually use `await auth()` from `@clerk/nextjs/server` in each App Router endpoint to retrieve the authenticated user's ID (`authUserId`) and validate any client-provided user IDs against it before returning sensitive data.
