## 2026-06-25 - Remove Hardcoded CEO Backdoor
**Vulnerability:** A hardcoded administrative backdoor (CEO_BYPASS_KEY and ayura_ceo_token) was found in the codebase, allowing unauthenticated bypassing of security controls.
**Learning:** Hardcoded bypass keys in APIs often get left behind from early development and represent critical security risks.
**Prevention:** Always rely on standardized and secure Role-Based Access Control (RBAC) systems for administrative access instead of hardcoded tokens.
