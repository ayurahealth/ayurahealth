## 2026-07-16 - [Critical] Hardcoded CEO Bypass Backdoor Removed
**Vulnerability:** A hardcoded CEO bypass key (`ayura_ceo_token`) was used in `app/api/auth/ceo-pass/route.ts` and `app/api/chat/route.ts` to give unmetered access to AI credits bypassing standard paywalls and limits.
**Learning:** Administrative access was implemented through a fragile and vulnerable bypass token rather than a robust RBAC (Role-Based Access Control) system, leaving the system open to complete compromise if the token was leaked.
**Prevention:** Always rely on proper role-based authentication and authorization mechanisms rather than secret backdoors. Ensure sensitive privileges are explicitly tied to verified identities and roles.
