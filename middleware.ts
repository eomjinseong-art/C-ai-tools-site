import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const video = searchParams.get("video");

  if (pathname === "/") {
    if (!q && !category && !video) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.search = "";
    if (q) {
      url.pathname = "/search";
      url.searchParams.set("q", q);
      return NextResponse.redirect(url);
    }
    if (category) {
      url.pathname = `/category/${category}`;
      if (video) url.searchParams.set("video", video);
      return NextResponse.redirect(url);
    }
    url.pathname = `/video/${video}`;
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/category/") && video) {
    const url = request.nextUrl.clone();
    url.pathname = `/video/${video}`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/category/:path*"],
};
