## 2026-05-29 - [CRITICAL] Removed CEO_BYPASS_KEY backdoor
**Vulnerability:** A hardcoded administrative backdoor (`CEO_BYPASS_KEY` and `ayura_ceo_token`) was present, bypassing authentication/rate limits.
**Learning:** Hardcoded backdoors bypass proper Role-Based Access Control (RBAC) and pose a severe security risk if the key is compromised.
**Prevention:** Always rely on a standardized and secure Role-Based Access Control (RBAC) system for administrative access.
