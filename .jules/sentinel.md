## 2024-10-25 - App Router API IDOR Vulnerability
**Vulnerability:** Chat history endpoint accepts a user ID parameter without verifying it belongs to the authenticated user.
**Learning:** In this Next.js application, App Router API endpoints do not enforce global authorization middleware, creating a surprising architectural gap where authentication must be manually checked in each endpoint.
**Prevention:** Manually use `await auth()` from `@clerk/nextjs/server` in each endpoint to retrieve the authenticated user's ID and validate any client-provided user IDs against it before returning sensitive data.
