## 2026-04-21 - [Timing Attack Vulnerability in Custom Auth]
**Vulnerability:** A standard string comparison (`key !== CEO_BYPASS_KEY`) was used for authentication bypass in `app/api/auth/ceo-pass/route.ts`.
**Learning:** This could allow an attacker to determine the `CEO_BYPASS_KEY` byte by byte by measuring the time it takes for the comparison to fail.
**Prevention:** Always use constant-time string comparison algorithms like `crypto.timingSafeEqual` to verify tokens, secrets, passwords or bypass keys.
