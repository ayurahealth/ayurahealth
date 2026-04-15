## 2025-01-20 - Parallelize LLM Agent Orchestration
**Learning:** Independent agent reasoning steps (like 'planner' and 'researcher' roles) often block the main thread sequentially when waiting for LLM network requests. Parallelizing these with Promise.all significantly reduces overall orchestration latency, often halving the wait time for these intermediate steps.
**Action:** When orchestrating multiple LLM calls in backend logic, always evaluate if they are sequentially dependent. If not, use `Promise.all` to fetch responses concurrently.
