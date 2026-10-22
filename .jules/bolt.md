## 2026-10-22 - Prevent intra-request duplicates in batch inserts
**Learning:** When fixing N+1 query problems by replacing a sequential `findFirst` and `create` loop with batched `findMany` and `createMany` operations, explicitly handle intra-request duplicates in the input array. The original sequential loop inherently prevents duplicates if the input contains identical items, whereas a naive batched approach does not.
**Action:** Use a `Set` during the filtering step to track and skip duplicate entries within the same request.
