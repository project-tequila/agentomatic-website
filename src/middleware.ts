import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Single crawl host — matches DEFAULT_SITE_URL / production brand. */
const CANONICAL_HOST = "www.agentomatic.in";

const REDIRECT_HOSTS = new Set([
  "agentomatic.in",
  "agentomatic.com",
  "www.agentomatic.com",
]);

/**
 * Permanent host consolidation for SEO. Runs when these hosts resolve to this
 * deployment. If a host points at a different project (e.g. .com lander), DNS
 * must be pointed here first — middleware cannot fix that.
 */
export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host");
  if (!hostHeader) {
    return NextResponse.next();
  }

  const host = hostHeader.split(":")[0]?.toLowerCase();
  if (!host || !REDIRECT_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.host = CANONICAL_HOST;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
