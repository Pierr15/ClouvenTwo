import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth-config";

const protectedRoutes = [
  "/dashboard",
  "/members",
  "/schedule",
  "/assignments",
  "/explorer",
  "/profile",
  "/settings",
  "/terminal",
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Belum login tetapi mencoba membuka halaman protected
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Sudah login tetapi mencoba membuka halaman login
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/members/:path*",
    "/schedule/:path*",
    "/assignments/:path*",
    "/explorer/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/terminal/:path*",
    "/login",
  ],
};