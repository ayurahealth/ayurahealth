Plan:
1. Update `app/api/auth/ceo-pass/route.ts` to hash the `CEO_BYPASS_KEY` before setting it in the cookie.
2. Update `app/api/chat/route.ts` to hash the `CEO_BYPASS_KEY` to compare against the hashed token in the cookie.
