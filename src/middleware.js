// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get user data from cookies or headers (since we can't access localStorage in middleware)
  // For now, we'll let client-side handle auth checks
  // This middleware mainly handles redirect logic

  // Redirect root to dashboard if accessing /
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow access to login page
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // For dashboard routes, let client-side components handle auth
  // since middleware can't access localStorage
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
