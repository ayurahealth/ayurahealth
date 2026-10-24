## 2024-05-18 - IDOR in Next.js App Router API
**Vulnerability:** Found an IDOR vulnerability in an API endpoint where a client-provided user ID was trusted without validating it against the authenticated session.
**Learning:** Next.js App Router API endpoints do not enforce global authorization middleware for data ownership. Even if a user is authenticated, we must manually check if they own the resource.
**Prevention:** Always use `await auth()` in the API endpoint to fetch the authenticated user's ID and explicitly compare it against any user IDs provided in the request before returning sensitive data.
