## 2025-02-14 - [Timing Attack Vulnerability in Secret Comparison]
**Vulnerability:** The application was using simple string equality operators (`===`) to verify highly sensitive tokens like `CEO_BYPASS_KEY` against user input in multiple routes (`app/api/auth/ceo-pass/route.ts` and `app/api/chat/route.ts`).
**Learning:** Standard string comparison operators in JavaScript compare characters one by one and exit at the first mismatch. This creates a timing discrepancy that attackers can measure to guess the secret key character by character (a timing attack).
**Prevention:** Always use `crypto.timingSafeEqual(Buffer.from(input), Buffer.from(secret))` when comparing sensitive tokens, secrets, or passwords to ensure constant-time comparison, making timing attacks infeasible.
