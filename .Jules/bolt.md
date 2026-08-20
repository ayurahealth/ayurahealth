## 2024-08-20 - Nav component scroll listener
**Learning:** The Nav component uses an un-throttled scroll event listener to change the navigation bar's appearance. In React, this causes state updates and re-renders on every single scroll tick, which is a known performance anti-pattern.
**Action:** Always throttle or debounce frequent event listeners like `scroll` or `resize`, or consider using Intersection Observer for scroll-based state changes if it's just about crossing a threshold.
