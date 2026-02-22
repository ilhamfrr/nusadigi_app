import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Production domain
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "nusadigi.id";

// Public paths that don't require authentication
const PUBLIC_PATHS = ["/", "/login", "/register", "/pricing", "/features", "/about"];

// Protected path prefixes
const PROTECTED_PREFIXES = ["/dashboard", "/admin", "/api/protected"];

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // ─── Subdomain detection ────────────────────────────────────────────────
  const host = request.headers.get("host") || hostname;
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");

  let subdomain: string | null = null;

  if (isLocalhost) {
    // Dev: subdomain extracted from e.g. "acme.localhost:3000"
    const parts = host.split(".");
    if (parts.length > 1 && parts[0] !== "www") {
      subdomain = parts[0];
    }
  } else {
    // Production: extract subdomain from nusadigi.id
    if (host.endsWith(`.${ROOT_DOMAIN}`)) {
      const sub = host.replace(`.${ROOT_DOMAIN}`, "");
      if (sub !== "www") {
        subdomain = sub;
      }
    }
  }

  // ─── Static assets & Next.js internals - skip ───────────────────────────
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // ─── Tenant subdomain routing ────────────────────────────────────────────
  if (subdomain) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-tenant-subdomain", subdomain);
    requestHeaders.set("x-tenant-host", host);

    // Rewrite to tenant-specific layout
    const url = request.nextUrl.clone();
    url.pathname = `/tenant/${subdomain}${pathname}`;

    return NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
  }

  // ─── Auth protection for dashboard routes ───────────────────────────────
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected) {
    const session = await auth();
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // RBAC: Super admin only routes
    if (pathname.startsWith("/dashboard/admin") && session.user?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // ─── Redirect auth pages for logged-in users ────────────────────────────
  if (["/login", "/register"].includes(pathname)) {
    const session = await auth();
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
