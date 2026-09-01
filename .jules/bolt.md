## 2026-06-30 - [Bulk DB Operations in Prisma]
**Learning:** Sequential `findFirst` and `create` operations inside loops cause N+1 query performance bottlenecks in Next.js/Prisma APIs.
**Action:** Use a single `findMany` with an `in:` clause, perform in-memory difference checking using a `Set` (updating it via `.reduce()` to handle intra-payload duplicates), and execute a bulk `createMany`.
