## 2024-05-24 - [Remove CEO Bypass Backdoor]
**Vulnerability:** Hardcoded backdoor bypass token (`CEO_BYPASS_KEY`) providing unmetered access to rate limits and potentially other features.
**Learning:** Hardcoded bypass tokens bypass rate limits and auth, posing massive risk.
**Prevention:** Strictly prohibit any hardcoded authentication bypass mechanisms, rely solely on established RBAC.
