## 2024-05-24 - [CRITICAL] Hardcoded CEO Bypass Backdoor
**Vulnerability:** Found a hardcoded authentication bypass key (CEO_BYPASS_KEY) and backdoor route (/api/auth/ceo-pass) that allowed bypassing rate limits and accessing the system without authentication.
**Learning:** Hardcoded bypass keys, even if intended for administrative or owner use, are severe security vulnerabilities because they bypass standardized Role-Based Access Control (RBAC) and can lead to full system compromise if leaked. They bypass standard auth barriers completely.
**Prevention:** Never introduce or retain bypass keys or backdoor cookies. Always rely on a standardized and secure RBAC system (e.g., Clerk metadata or a database roles table) for administrative access.
