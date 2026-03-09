import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = ["/admin", "/student", "/profile"];
const PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/set-password",
];

const parseJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const payload = parseJwtPayload(token);
  const exp = payload?.exp;

  if (typeof exp !== "number") {
    return false;
  }

  return exp * 1000 < Date.now();
};

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
    if (isTokenExpired(token)) {
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
