import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, LOCALE_COOKIE, isLocale } from "@/shared/lib/i18n/config";

// "/" is the marketing landing page for logged-out visitors; the page itself
// redirects anyone already signed in to /home or /setup. "/en", "/pt-BR" and
// "/es-ES" are the same page pinned to one language for search engines.
const PUBLIC_ROUTES = [
  "/",
  ...LOCALES.map((locale) => `/${locale}`),
  "/login",
  "/signup",
  "/auth/callback",
  "/privacy",
  "/terms",
];

/** A one-year cookie, matching what the in-app language switcher writes. */
const LOCALE_COOKIE_MAX_AGE = 31536000;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A localized landing URL is a language declaration: pin it on the request
  // before anything renders, so `<html lang>`, the dictionary and the copy all
  // agree with the URL a crawler asked for. Set before the first response is
  // built — `NextResponse.next({ request })` snapshots the cookies as they are.
  const pathLocale = pathname.slice(1);
  const pinnedLocale = isLocale(pathLocale) ? pathLocale : null;
  if (pinnedLocale) request.cookies.set(LOCALE_COOKIE, pinnedLocale);

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicRoute =
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/join/") ||
    pathname.startsWith("/api/cron/"); // authenticated via CRON_SECRET, not a user session

  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Remember the language once the session cookies are settled, so the visitor
  // keeps reading it after they navigate away from the localized URL.
  if (pinnedLocale) {
    response.cookies.set(LOCALE_COOKIE, pinnedLocale, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Metadata routes are excluded rather than listed as public routes: a
    // crawler asking for robots.txt has no session, and redirecting it to
    // /login would hide the sitemap and the social card from every index.
    "/((?!_next/static|_next/image|favicon.ico|icon-192|icon-512|icon|apple-icon|manifest.webmanifest|robots.txt|sitemap.xml|opengraph-image).*)",
  ],
};
