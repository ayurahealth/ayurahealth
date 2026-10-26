## 2026-10-26 - [N+1 Query in Profile Sync]
**Learning:** Sequential findFirst and create operations in a loop cause N+1 query issues. When batching these with findMany and createMany, intra-request duplicates must be explicitly filtered out, because a naive batched approach does not inherently prevent duplicates within the same request like sequential loops do.
**Action:** Always use findMany and createMany for batch operations and explicitly filter out intra-request duplicates using a Set.
