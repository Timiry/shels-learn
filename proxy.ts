import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = ["/admin", "/student", "/profile"];
const PUBLIC_ROUTES = ["/login", "/forgot-password", "/set-password"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Пропускаем публичные маршруты
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Защищаем приватные маршруты
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const redirectUrl = new URL("/login", request.url);
    if (!token) {
      // redirectUrl.searchParams.set("redirect", pathname); //TODO: обработать перенаправление на старнице входа
      return NextResponse.redirect(redirectUrl);
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        return NextResponse.redirect(redirectUrl);
      }
    } catch {
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
