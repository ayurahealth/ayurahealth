## 2026-06-16 - Bulk Syncing User Memories Database Bottleneck
**Learning:** Sequential findFirst and create operations inside loops for bulk syncing user memories cause N+1 query problems, slowing down database performance.
**Action:** Always use a single findMany with an in: clause, perform in-memory difference checking using a Set (updating the Set during iteration using .reduce() to handle intra-payload duplicates), and execute a bulk createMany to avoid N+1 queries.
