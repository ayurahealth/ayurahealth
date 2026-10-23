## 2026-10-23 - Fix N+1 Query in Profile Sync
**Learning:** Found an N+1 query loop when syncing user memories, which performs multiple sequential database calls, slowing down the profile sync endpoint.
**Action:** Use batched operations (`findMany` and `createMany`) to combine database calls into two queries, reducing load and improving endpoint latency. Using a Set is important to deduplicate intra-request memories.
