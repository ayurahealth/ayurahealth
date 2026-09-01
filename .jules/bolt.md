## 2026-07-03 - Bulk Database Inserts
**Learning:** Next.js/Prisma APIs can suffer from N+1 sequential database operations when syncing arrays (like user memories), causing unnecessary latency.
**Action:** Use a single `findMany` with an `in:` clause, perform in-memory difference checking using a `Set` (updating it during iteration), and execute a bulk `createMany` instead of looping over `findFirst` and `create`.
