
## 2024-05-20 - N+1 query optimization in HealthProfile Sync
**Learning:** Sequential findFirst and create in a loop inherently prevents duplicates if the input contains identical items, whereas a naive batched approach does not.
**Action:** When fixing N+1 query problems by batching, use a Set during the filtering step to track and skip duplicate entries within the same request.
