import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname === "/pages/signin") {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (pathname === "/pages/home") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (pathname === "/pages/math" || pathname.startsWith("/pages/math/")) {
    return NextResponse.redirect(new URL("/math", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pages/:path*"],
};
