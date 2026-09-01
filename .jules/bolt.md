## 2026-06-14 - Fix N+1 database queries in memory sync
**Learning:** Next.js APIs executing sequential Prisma queries in loops (N+1 issue) can cause performance bottlenecks and database lockups. Batch processing is critical for performance.
**Action:** Replaced sequential findFirst/create loop with a single findMany using an in-clause, an in-memory Set for duplicate detection, and a bulk createMany.
