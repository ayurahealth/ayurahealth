## 2024-05-18 - [Critical Authentication Bypass]
**Vulnerability:** A hardcoded CEO bypass backdoor using `CEO_BYPASS_KEY` and `ayura_ceo_token` allowed unauthenticated access to the application and bypassed rate limits.
**Learning:** Hardcoded access keys or bypass tokens must never be used. All access should rely on a standardized and secure Role-Based Access Control (RBAC) system.
**Prevention:** Ensure access controls are always properly verified against the authenticated user's session and roles, not statically configured secrets.
