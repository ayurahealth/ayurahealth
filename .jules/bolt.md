## 2024-05-24 - [N+1 Query Fix]
**Learning:** The memory sync loop created an N+1 query problem by checking and inserting each memory individually, which could severely impact performance on large syncs.
**Action:** Replaced sequential findFirst/create loop with batched findMany/createMany and used a Set to handle intra-request duplicates.
