## 2024-11-20 - Removed CEO Bypass Backdoor
**Vulnerability:** A hardcoded authentication bypass (CEO_BYPASS_KEY) existed in the API routes, allowing unrestricted access and bypassing rate limits.
**Learning:** Administrative backdoors should never be hardcoded into application logic. Such mechanisms create critical security risks if the key is exposed.
**Prevention:** Rely entirely on standardized Role-Based Access Control (RBAC) systems for administrative or elevated access.
