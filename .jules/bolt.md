## 2026-06-17 - [N+1 Prisma Query Anti-Pattern]
**Learning:** Sequential findFirst/create operations in API routes (like profile sync) cause severe latency through N+1 queries to the database.
**Action:** Use a single findMany with an 'in:' clause, perform in-memory difference checking using a Set (updated via .reduce()), and execute a bulk createMany.
