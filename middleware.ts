import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to the login page itself
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Check for admin_session cookie on all /admin routes
  if (pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("admin_session");

    if (!authCookie || authCookie.value !== "authenticated") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};