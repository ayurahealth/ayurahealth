## 2024-05-01 - [Remove CEO Backdoor Authorization Bypass]
**Vulnerability:** Found a hardcoded `CEO_BYPASS_KEY` backdoor in `app/api/auth/ceo-pass/route.ts` which sets a cookie granting unlimited AI requests, rate-limit bypassing, and paywall bypassing.
**Learning:** Intentional administrative backdoors often act as severe authorization bypass vulnerabilities, breaking zero-trust security paradigms.
**Prevention:** Avoid intentional backdoors. Enforce strict role-based access control (RBAC) integrated deeply into normal authorization flows (e.g. Clerk roles) rather than separate token mechanisms.
