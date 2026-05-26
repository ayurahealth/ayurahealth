## 2024-05-18 - Admin Backdoor (CEO_BYPASS_KEY)
**Vulnerability:** A hardcoded authentication bypass mechanism (`CEO_BYPASS_KEY`) was found in `app/api/chat/route.ts` and `app/api/auth/ceo-pass/route.ts`. This allows anyone who sets a specific cookie matching the environment variable to bypass rate limits, paywalls, and authentication.
**Learning:** Even 'intended' administrative backdoors create massive security risks. A leaked environment variable immediately leads to complete system compromise. Node.js timing attacks were also possible because `===` was used instead of `crypto.timingSafeEqual` for string comparison.
**Prevention:** Never use hardcoded bypass keys or simple string equality for authentication. Always rely on a standardized Role-Based Access Control (RBAC) system.
