## 2024-08-01 - Remove CEO Bypass Authentication Backdoor
**Vulnerability:** A hardcoded "CEO bypass" key and cookie (`ayura_ceo_token`) were discovered in the codebase, granting unlimited access and bypassing rate limits and authentication checks.
**Learning:** Hardcoded backdoors (even for testing or admin access) pose a critical risk because they completely undermine RBAC and rate limit protections. If compromised, an attacker has unfettered system access.
**Prevention:** Never use hardcoded secrets or bypass keys to simulate admin functionality. Always rely on secure, role-based access control (RBAC) integrated deeply with existing auth systems.
