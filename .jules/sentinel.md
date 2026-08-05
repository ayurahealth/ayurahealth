## 2024-05-20 - Removal of Administrative Backdoor
**Vulnerability:** A hardcoded rate-limit bypass backdoor (`CEO_BYPASS_KEY` and `ayura_ceo_token`) was found in the codebase.
**Learning:** Hardcoded backdoor keys used for administrative ease leave the system highly vulnerable to unauthorized access and exploitation if the token is leaked.
**Prevention:** Rely strictly on established Role-Based Access Control (RBAC) via the primary auth provider. Never use hardcoded bypass cookies or environment keys for admin access.
