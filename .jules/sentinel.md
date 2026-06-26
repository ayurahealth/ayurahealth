## 2024-06-26 - Administrative Backdoor Bypass Key
**Vulnerability:** Found a hardcoded administrative backdoor (CEO_BYPASS_KEY) that allowed users to bypass Clerk authentication, paywalls, and usage limits by setting an ayura_ceo_token cookie.
**Learning:** Hardcoded bypass keys undermine the entire security model and RBAC system. They often get leaked or forgotten, providing unauthorized actors a permanent backdoor.
**Prevention:** Never introduce or retain hardcoded administrative bypass keys. Always rely on a standardized and secure Role-Based Access Control (RBAC) system for administrative access.
