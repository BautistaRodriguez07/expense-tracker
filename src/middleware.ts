import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
// import { NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/:locale",
]);

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    if (!isPublicRoute(req)) {
      auth.protect();
    }
    return;
  }

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
