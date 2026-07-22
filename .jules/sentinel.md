## 2026-07-22 - Admin Backdoor Removal
**Vulnerability:** A hardcoded CEO_BYPASS_KEY and ayura_ceo_token backdoor existed allowing bypass of rate limits and Clerk authentication.
**Learning:** Hardcoded bypass keys completely circumvent RBAC and pose a critical security risk.
**Prevention:** Rely strictly on a standardized Role-Based Access Control (RBAC) system for administrative access rather than secret keys and hardcoded cookies.
