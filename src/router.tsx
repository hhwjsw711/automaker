import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "./routeTree.gen";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import { fallbackLng, supportedLngs } from "./i18n/settings";
import {
  setPendingSsrLocale,
  getPendingSsrLocale,
  readCookieLocale,
  isPublicPath,
} from "./i18n/locale-detector";

const LOCALE_PREFIX_RE = new RegExp(
  `^/(${supportedLngs.join("|")})(/|$)`
);

function resolveOutputLocale(): string | null {
  return getPendingSsrLocale() ?? readCookieLocale();
}

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
          setPendingSsrLocale(null);
          const match = url.pathname.match(LOCALE_PREFIX_RE);
          if (match) {
            const locale = match[1] as string;
            if (supportedLngs.includes(locale as any)) {
              setPendingSsrLocale(locale);
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
          const locale = resolveOutputLocale();
          if (
            locale &&
            locale !== fallbackLng &&
            isPublicPath(url.pathname)
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

export const createRouter = getRouter;

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
