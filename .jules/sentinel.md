
## 2025-02-28 - Missing Authorization in Chat History Endpoint
**Vulnerability:** IDOR (Insecure Direct Object Reference) in `/api/chat/history/route.ts` where the `userId` parameter was used directly to fetch chat history without verifying it matched the authenticated user.
**Learning:** Next.js App Router API endpoints do not enforce global authorization middleware in this setup. Developers might assume passing `userId` in the query is sufficient when it's easily spoofed.
**Prevention:** Always use `await auth()` from `@clerk/nextjs/server` to retrieve the securely authenticated `authUserId` and validate any client-provided IDs against it before returning sensitive data.
