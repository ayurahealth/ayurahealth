
## 2025-05-18 - Authorization Bypass Backdoor
**Vulnerability:** A hardcoded authentication bypass key (`CEO_BYPASS_KEY`) allowed users to bypass rate limits and paywalls by setting a persistent `ayura_ceo_token` cookie.
**Learning:** Hardcoded backdoor secrets, even intended for testing or administrative ease, are extremely dangerous as they circumvent established security controls and expose endpoints.
**Prevention:** Do not implement backdoor tokens. Always rely on a standardized and secure Role-Based Access Control (RBAC) system for administrative access.
