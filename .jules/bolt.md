## 2024-10-25 - [Fixing N+1 Query With createMany]
**Learning:** The sequential findFirst and create loop inherently prevents duplicates if the input contains identical items, whereas a naive batched approach does not.
**Action:** When fixing N+1 query problems by replacing a sequential loop with findMany and createMany, explicitly handle intra-request duplicates in the input array by using a Set during the filtering step.
