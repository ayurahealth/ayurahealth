import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/contact",
  "/clinic",
  "/diet",
  "/privacy",
  "/terms",
  "/chat(.*)",
  "/api/webhooks(.*)",
  "/api/translate(.*)",
  "/api/chat(.*)",
  "/api/fetch-link(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // If Clerk keys are missing, don't crash. Just let the request pass.
  // This helps you see the page even before auth is fully configured.
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    console.warn("Clerk Publishable Key is missing. Middleware is bypassing auth protection.");
    return;
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
