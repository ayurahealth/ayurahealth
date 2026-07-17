## 2024-07-17 - Remove CEO Bypass Backdoor
**Vulnerability:** A hardcoded authentication and rate-limiting bypass backdoor was found (`CEO_BYPASS_KEY` / `ayura_ceo_token`).
**Learning:** Backdoors created for administrative or testing convenience create critical security risks if leaked, bypassing all platform protections (Clerk auth, rate limits, paywalls).
**Prevention:** Always rely on standardized and secure Role-Based Access Control (RBAC) systems for administrative access, never hardcoded tokens or bypass keys.
