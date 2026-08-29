import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "xi-tkj-2-session";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  const { pathname } = req.nextUrl;

  // Dashboard harus login
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Kalau sudah login tidak boleh kembali ke login
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