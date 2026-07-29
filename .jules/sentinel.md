## 2024-07-29 - [Remove Hardcoded Administrative Backdoor]
**Vulnerability:** A hardcoded CEO bypass key and cookie allowed unauthenticated users to bypass Clerk authentication, AI rate limits, and payment restrictions.
**Learning:** Hardcoding "admin" or "CEO" bypass paths directly in the code logic creates a massive vulnerability, especially if the secret is leaked or easily discoverable.
**Prevention:** Never use hardcoded secrets or arbitrary custom tokens to bypass standard authentication flows. Rely exclusively on established Role-Based Access Control (RBAC) configured via the primary identity provider (e.g., Clerk).
