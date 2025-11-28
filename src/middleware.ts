import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
// import { NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/:locale/forgot-password(.*)",
  "/",
  "/:locale",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl;

  // If it's an API/WEBHOOK route, don't apply INTL middleware
  if (pathname.startsWith("/api/webhooks")) {
    return;
  }

  // 2. Existing Auth logic
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    if (!isPublicRoute(req)) {
      auth.protect();
    }
    return;
  }

  // 3. Apply intl only if it's not a webhook
  const response = intlMiddleware(req);

  if (!isPublicRoute(req)) {
    auth.protect();
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
