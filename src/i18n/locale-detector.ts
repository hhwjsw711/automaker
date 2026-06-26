import { fallbackLng, supportedLngs, cookieName } from "./settings";
import type { SupportedLocale } from "./settings";

// ── Request-scoped pending locale ──────────────────────────────────────────
// Set synchronously by rewrite.input and consumed in the same SSR render cycle.
// Safe because the SSR lifecycle is synchronous: input → route match → loader → render.
let _pendingSsrLocale: string | null = null;

export function setPendingSsrLocale(locale: string | null): void {
  _pendingSsrLocale = locale;
}

export function getPendingSsrLocale(): string | null {
  return _pendingSsrLocale;
}

// ── Client-side cookie reader ──────────────────────────────────────────────

export function readCookieLocale(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + cookieName + "=([^;]*)")
  );
  const locale = match?.[1] ?? null;
  if (locale && supportedLngs.includes(locale as SupportedLocale)) {
    return locale;
  }
  return null;
}

// ── Unified locale resolution (SSR + client) ──────────────────────────────

function validateLocale(raw: string | null | undefined): string | null {
  if (raw && supportedLngs.includes(raw as SupportedLocale)) return raw;
  return null;
}

export function resolveClientLocale(
  pendingLocale: string | null
): string {
  return validateLocale(pendingLocale) ?? readCookieLocale() ?? fallbackLng;
}

export async function resolveInitialLocale(): Promise<string> {
  const pending = getPendingSsrLocale();
  if (pending) return pending;

  if (import.meta.env.SSR) {
    try {
      const { getCookie } = await import("@tanstack/react-start/server");
      return validateLocale(getCookie(cookieName)) ?? fallbackLng;
    } catch {
      // getCookie not available
    }
  }

  return fallbackLng;
}

// ── URL prefix utilities ──────────────────────────────────────────────────

const LOCALE_PREFIX_RE = new RegExp(
  `^/(${supportedLngs.join("|")})(/|$)`
);

export function hasLocalePrefix(pathname: string): boolean {
  return LOCALE_PREFIX_RE.test(pathname);
}

export function stripLocalePrefix(pathname: string): string {
  return pathname.replace(LOCALE_PREFIX_RE, "$2") || "/";
}

export function buildLocalePath(pathname: string, locale: string): string {
  if (locale === fallbackLng) return pathname;
  const prefix = `/${locale}`;
  if (pathname.startsWith(prefix)) return pathname;
  const bare = stripLocalePrefix(pathname);
  return `${prefix}${bare}`;
}

// ── Public path detection (allow-list for rewrite.output) ──────────────────
// Only paths matching these prefixes receive locale URL prefixing.
// Internal/admin/app paths are excluded by default — no deny-list to maintain.

const PUBLIC_PATH_PREFIXES = [
  "/about",
  "/affiliates",
  "/agents",
  "/blog",
  "/community",
  "/launch-kits",
  "/learn",
  "/members",
  "/news",
  "/privacy-policy",
  "/refund-policy",
  "/terms-of-service",
];

export function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}
