## 2024-06-06 - [Removed Hardcoded Backdoor Key]
**Vulnerability:** A hardcoded `CEO_BYPASS_KEY` was found in `app/api/auth/ceo-pass/route.ts` and `app/api/chat/route.ts` allowing unmetered access if the key was known.
**Learning:** Hardcoded bypass keys, even if read from environment variables, create a significant security risk by circumventing proper authentication and authorization flows.
**Prevention:** Avoid implementing custom bypass routes that set long-lived administrative cookies based on a single shared secret. Always rely on a standardized and secure Role-Based Access Control (RBAC) system for administrative access.
