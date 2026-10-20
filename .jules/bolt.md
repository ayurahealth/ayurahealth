## 2026-10-20 - [Optimize N+1 query loop with batching]
**Learning:** Naive batched upserts via sequential array loops might hit duplicate primary keys in the same tick. Needs a deduplicated Set or createMany optimization.
**Action:** Replaced sequential findFirst/create loop in memory sync with batched unique check and createMany
