import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

const protectedSegments = ["board"];

const getPreferredLocale = (request: NextRequest): Locale => {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const preferredLanguages = acceptLanguage
    .split(",")
    .map((language) => language.split(";")[0].trim().slice(0, 2).toLowerCase());

  return preferredLanguages.find(isLocale) ?? defaultLocale;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [firstSegment = "", secondSegment = ""] = pathname.split("/").filter(Boolean);

  if (!isLocale(firstSegment)) {
    request.nextUrl.pathname = `/${getPreferredLocale(request)}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  if (protectedSegments.includes(secondSegment) && !getSessionCookie(request)) {
    return NextResponse.redirect(new URL(`/${firstSegment}`, request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
