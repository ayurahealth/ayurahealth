## 2024-10-29 - [N+1 Query Anti-Pattern in HealthProfile Sync]
**Learning:** Sequential findFirst and create loops cause significant N+1 query bottlenecks in batch processing.
**Action:** Use findMany and createMany for batching, tracking duplicates with a Set during filtering.
