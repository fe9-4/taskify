import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const { pathname } = request.nextUrl;

  // 인증이 필요하지 않은 페이지 목록
  const publicPages = ["/", "/login", "/signup"];
  const isPublicPage = publicPages.some((page) => pathname === page);
  const isAuthPage = ["/login", "/signup"].includes(pathname);

  // API 라우트에 대한 처리
  if (pathname.startsWith("/api")) {
    // /api/auth로 시작하는 경로는 제외
    if (pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    // 토큰이 없는 경우 401 응답
    if (!accessToken) {
      return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
    }
  }

  // 로그인된 사용자가 로그인/회원가입 페이지 접근 시 홈으로 리다이렉트
  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 페이지 라우트에 대한 처리
  if (!accessToken && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // API 라우트
    "/api/:path*",
    // 모든 페이지 라우트 (단, _next/static, _next/image, favicon.ico, public 폴더 제외)
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg)).*)",
  ],
};
