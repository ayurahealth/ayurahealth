## 2024-05-18 - Remove Hardcoded Administrative Backdoor
**Vulnerability:** A hardcoded authentication bypass key (CEO_BYPASS_KEY) allowed users to circumvent Clerk authentication and rate limits by setting a specific cookie.
**Learning:** Hardcoded backdoors, even if intended for administrative or "owner" access, pose a severe security risk. They bypass established RBAC and audit trails.
**Prevention:** Always rely on a standardized and secure Role-Based Access Control (RBAC) system for administrative access. Never introduce or retain hardcoded keys or tokens.
