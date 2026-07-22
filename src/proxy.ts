import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/products",
  "/categories",
  "/sellers",
  "/api/auth",
  "/favicon.ico",
  "/_next",
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public, auth, and static routes
  // "/" must be matched exactly — not via startsWith — to avoid bypassing auth checks
  if (
    pathname === "/" ||
    publicRoutes
      .filter((r) => r !== "/")
      .some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  // Check for session cookie (Better Auth sets this as part of Better Auth's cookie config)
  const sessionCookie = request.cookies.get("better-auth.session_token")?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};