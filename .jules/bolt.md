## 2024-05-24 - Optimize N+1 Query in Memory Sync
**Learning:** The profile sync endpoint suffered from an N+1 query bottleneck by sequentially calling findFirst and create for each memory.
**Action:** Replace sequential queries with batched findMany and createMany, explicitly tracking intra-request duplicates using a Set.
