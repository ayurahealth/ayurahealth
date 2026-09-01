## 2024-06-19 - Batch Sync User Memories
**Learning:** Next.js API routes using Prisma can experience severe N+1 bottlenecks when sequentially checking and creating records in loops (e.g., syncing user memories).
**Action:** Use a single `findMany` with an `in` clause and a Set to perform in-memory difference checking (updating the Set during iteration to avoid intra-payload duplicates), followed by a bulk `createMany`.
