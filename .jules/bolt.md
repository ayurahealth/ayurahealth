## 2024-05-24 - Optimizing setInterval in VedicClockWidget
**Learning:** `VedicClockWidget` uses a naive `setInterval` running every 60 seconds to update the time for determining the dosha period. This causes an unnecessary state update and re-render every minute, even if the user isn't actively engaging or if the dosha period hasn't actually changed.
**Action:** Calculate the exact time remaining until the next relevant change and set a timeout for that specific duration to prevent unnecessary re-renders in background tasks.
