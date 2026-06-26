import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "./routeTree.gen";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import { fallbackLng, supportedLngs } from "./i18n/settings";

const LOCALE_PREFIX_RE = /^\/(en|zh)(\/|$)/;
const INTERNAL_PATH_RE =
  /^\/(admin|learn|api|profile|settings|login|dev-login|purchase|success|cancel|unsubscribe|unauthenticated|unauthorized|create-testimonial|affiliate-dashboard|health|sitemap)(\/|$)/;

let _pendingSsrLocale: string | null = null;

export function getPendingSsrLocale(): string | null {
  return _pendingSsrLocale;
}

function readCookieLocale(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|;\\s*)lang=([^;]*)")
  );
  return match?.[1] ?? null;
}

export { readCookieLocale as readClientCookieLocale };

function getLocale(): string | null {
  if (_pendingSsrLocale) return _pendingSsrLocale;
  return readCookieLocale();
}

// NOTE: Most of the integration code found here is experimental and will
// definitely end up in a more streamlined API in the future. This is just
// to show what's possible with the current APIs.

export function getRouter() {
  const queryClient = new QueryClient();

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      scrollRestoration: true,
      context: { queryClient },
      defaultPreload: "intent",
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: () => <NotFound />,
      rewrite: {
        input: ({ url }) => {
          _pendingSsrLocale = null;
          const match = url.pathname.match(LOCALE_PREFIX_RE);
          if (match) {
            const locale = match[1];
            if (supportedLngs.includes(locale as any)) {
              _pendingSsrLocale = locale;
              url.pathname =
                url.pathname.replace(LOCALE_PREFIX_RE, "$2") || "/";
              if (typeof document !== "undefined") {
                document.cookie = `lang=${locale};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
              }
            }
          }
          return url;
        },
        output: ({ url }) => {
          const locale = getLocale();
          if (
            locale &&
            locale !== fallbackLng &&
            !INTERNAL_PATH_RE.test(url.pathname)
          ) {
            const prefix = `/${locale}`;
            if (!url.pathname.startsWith(prefix)) {
              url.pathname = `${prefix}${url.pathname}`;
            }
          }
          return url;
        },
      },
    }),
    queryClient
  );
}

// Keep createRouter as an alias for backwards compatibility
export const createRouter = getRouter;

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
