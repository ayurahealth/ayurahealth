## 2026-06-18 - [Bulk DB Queries]
**Learning:** Found N+1 query issue in Next.js/Prisma APIs when syncing user memories.
**Action:** Replaced sequential findFirst/create loop with a single findMany and bulk createMany using a Set for in-memory difference checking.
