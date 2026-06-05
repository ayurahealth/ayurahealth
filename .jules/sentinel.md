## 2026-06-05 - Timing Attacks in Authentication Bypass
**Vulnerability:** Found standard string equality (`===`) used for checking sensitive `CEO_BYPASS_KEY` in `app/api/auth/ceo-pass/route.ts` and `app/api/chat/route.ts`, which is vulnerable to timing attacks.
**Learning:** In Next.js edge and Node.js environments, even internal admin bypasses must use `crypto.timingSafeEqual` to prevent brute-forcing via timing differences. Dynamic imports for `crypto` are required for edge routes.
**Prevention:** Always use `crypto.timingSafeEqual` with proper length checks for any sensitive secret comparison, even for simple string keys.
