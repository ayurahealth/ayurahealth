## 2024-07-13 - Bulk Database Operations
**Learning:** Found an N+1 query anti-pattern in the profile sync API where user memories were being individually queried and inserted in a loop.
**Action:** Use `findMany` with `in:` clause to fetch all existing records, deduplicate in-memory using a `Set` and `reduce`, and insert in bulk using `createMany` to minimize database roundtrips.
