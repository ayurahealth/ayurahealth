## 2024-07-10 - [Remove Admin Backdoor]
**Vulnerability:** A hardcoded bypass key (`CEO_BYPASS_KEY`) and an associated `ayura_ceo_token` were present in the codebase, enabling unmetered, unauthorized access and rate limit bypassing.
**Learning:** Hardcoded administration or developer backdoor bypass mechanisms are extremely dangerous. If leaked, they lead to full, unauthenticated application compromise and financial damage.
**Prevention:** Rely strictly on Role-Based Access Control (RBAC) via the primary authentication system (e.g., Clerk) to manage elevated privileges securely without hardcoded backdoors.
