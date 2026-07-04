## 2026-07-04 - Prevent Leftover Variables Breaking the Build
**Vulnerability:** A hardcoded CEO authentication backdoor was removed but it left behind undefined variable references that broke the build.
**Learning:** Removing a variable definition but keeping references to it will cause a ReferenceError and fail TypeScript compilation, which fails the CI pipeline. In Next.js this will also crash the app.
**Prevention:** Always trace the removed variable usages down the line, such as arguments in function calls, to ensure the code remains fully functional after the security fix.
