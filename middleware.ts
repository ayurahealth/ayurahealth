import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define unauthenticated routes (e.g., landing page, quiz could be left unauthenticated depending on requirement)
// But wait, user wanted "like ChatGPT" so /chat must be protected
const isProtectedRoute = createRouteMatcher(["/chat(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // If the user isn't authenticated and tries to access /chat, they will be redirected to the sign-in modal/page
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
