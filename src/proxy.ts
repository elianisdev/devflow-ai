import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

const getPreferredLocale = (request: NextRequest): Locale => {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const preferredLanguages = acceptLanguage
    .split(",")
    .map((language) => language.split(";")[0].trim().slice(0, 2).toLowerCase());

  return preferredLanguages.find(isLocale) ?? defaultLocale;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [firstSegment = ""] = pathname.split("/").filter(Boolean);

  if (isLocale(firstSegment)) return;

  request.nextUrl.pathname = `/${getPreferredLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
