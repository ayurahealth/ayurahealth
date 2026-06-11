## 2024-06-11 - Hardcoded Administrative Backdoor Bypass
**Vulnerability:** A hardcoded CEO_BYPASS_KEY was used to bypass standard authentication, allowing an administrative backdoor.
**Learning:** Administrative access should never rely on hardcoded secrets or arbitrary custom tokens.
**Prevention:** Rely on a standardized and secure Role-Based Access Control (RBAC) system for administrative access.
