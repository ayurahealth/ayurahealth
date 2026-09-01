## 2025-02-14 - Bulk Database Syncing
**Learning:** Sequential findFirst and create calls in a loop cause an N+1 query problem, slowing down memory syncing.
**Action:** Use findMany with an in: clause, process differences in memory using a Set (updated iteratively with .reduce to handle intra-payload duplicates), and execute a bulk createMany.
