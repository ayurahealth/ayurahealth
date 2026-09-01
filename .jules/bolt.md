## 2026-06-15 - Prevent N+1 Database Queries in Bulk Sync
**Learning:** Next.js/Prisma APIs can suffer from N+1 sequential query bottlenecks if findFirst and create are used inside loops. We must also handle intra-payload duplicates carefully.
**Action:** Always use a single findMany with an in: clause and an in-memory Set with .reduce() to filter duplicates before executing a bulk createMany.
