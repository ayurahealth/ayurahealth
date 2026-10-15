
## 2025-02-28 - [IDOR Vulnerability in API Route]
**Vulnerability:** Found an Insecure Direct Object Reference (IDOR) vulnerability in `app/api/chat/history/route.ts` where the `GET` endpoint accepted a `userId` query parameter without checking if it matched the currently authenticated user.
**Learning:** Next.js API routes in this application do not enforce global authorization middleware for checking resource ownership.
**Prevention:** Always explicitly use `const { userId: authUserId } = await auth()` from `@clerk/nextjs/server` to authenticate requests and validate any client-provided IDs against it before returning sensitive data.
