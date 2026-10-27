## 2026-10-27 - [Batched Upserts for Profile Sync]
**Learning:** The sync endpoints often iterate over external integrations or health profiles and use sequential `findFirst`/`create` queries, which causes N+1 query latency issues.
**Action:** Replaced sequential queries with Prisma's `findMany` (using `in`) and `createMany`, while explicitly handling intra-request duplicates using a Set.
