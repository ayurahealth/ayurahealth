## 2026-10-28 - [Optimize N+1 Query in Profile Sync]
**Learning:** In Next.js API routes handling arrays of user inputs, sequential `findFirst` and `create` queries in a loop lead to N+1 performance bottlenecks. We must also consider duplicate requests inside the input array which sequential loops handle naturally but naive batched queries do not.
**Action:** Use `findMany` with an `in` clause and `createMany` instead of sequential queries, and use a `Set` to filter out duplicates in the payload when batch creating.
