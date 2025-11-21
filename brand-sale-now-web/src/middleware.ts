import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin 경로로 접근 시
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("admin-session");
    const isLoggedIn = !!sessionCookie?.value;

    // 로그인 페이지인지 확인
    const isLoginPage = pathname.startsWith("/admin/login");

    // 로그인 페이지가 아닌데 세션이 없으면 로그인 페이지로 리다이렉트
    if (!isLoginPage && !isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // 이미 로그인된 상태에서 로그인 페이지 접근 시 대시보드로 리다이렉트
    if (isLoginPage && isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // 쿠키가 있지만 형식이 잘못된 경우 (서명 형식: value.signature)
    if (isLoggedIn && !sessionCookie.value.includes(".")) {
      const response = NextResponse.next();
      response.cookies.delete("admin-session");
      return response;
    }

    // 경로 정보를 헤더에 추가 (layout에서 사용)
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
