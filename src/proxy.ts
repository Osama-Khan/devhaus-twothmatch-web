import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Security headers applied to all responses.
 * CSP is relaxed in development to allow Next.js HMR.
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (!isDev) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    const connectSrc = ["'self'", apiUrl].filter(Boolean).join(" ");

    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        `connect-src ${connectSrc}`,
        "img-src 'self' data: blob:",
        "font-src 'self'",
        "frame-ancestors 'none'",
      ].join("; ")
    );
  }

  return response;
}

/** Middleware entry — applies security headers to every matched route */
export function proxy(_request: NextRequest) {
  const response = NextResponse.next();
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
