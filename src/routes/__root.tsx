/// <reference types="vite/client" />
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
  redirect,
} from "@tanstack/react-router";
import { HeadContent, Scripts } from "@tanstack/react-router";
import * as React from "react";
import { type QueryClient } from "@tanstack/react-query";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";
import { Header } from "~/routes/-components/header";
import { FooterSection } from "~/routes/-components/footer";
import { ThemeProvider } from "~/components/ThemeProvider";
import { ThemeToggle } from "~/components/theme-toggle";
import { Toaster, type ToasterProps } from "sonner";
import { useTheme } from "~/components/ThemeProvider";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { shouldShowEarlyAccessFn } from "~/fn/early-access";
import { useAnalytics } from "~/hooks/use-analytics";
import { publicEnv } from "~/utils/env-public";
import { lazy, Suspense } from "react";
import { I18nProvider } from "~/i18n/i18n-provider";
import { fallbackLng, cookieName, supportedLngs, isRtl, localeToOgLocale } from "~/i18n/settings";
import type { SupportedLocale } from "~/i18n/settings";

// Lazy load DevFloatingMenu - only needed in development
const DevFloatingMenu = lazy(() =>
  import("~/components/dev-menu/dev-floating-menu").then((m) => ({
    default: m.DevFloatingMenu,
  }))
);
import { getCurrentUserIdFn } from "~/fn/auth";

// OpenGraph image configuration
const OG_IMAGE_PATH = "/marketing.png";
const getOgImageUrl = () => {
  const baseUrl = publicEnv.VITE_HOST_NAME.replace(/\/$/, "");
  return `${baseUrl}${OG_IMAGE_PATH}`;
};

import {
  getPendingSsrLocale,
  resolveClientLocale,
  resolveInitialLocale,
  readCookieLocale,
  isPublicPath,
} from "~/i18n/locale-detector";

const isDev = process.env.NODE_ENV === "development";



function ThemedToaster() {
  const { theme } = useTheme();
  const [resolvedTheme, setResolvedTheme] =
    React.useState<ToasterProps["theme"]>("light");

  React.useEffect(() => {
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setResolvedTheme(isDark ? "dark" : "light");
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  return <Toaster theme={resolvedTheme} />;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    beforeLoad: async ({ location }) => {
      const shouldShowEarlyAccess = await shouldShowEarlyAccessFn();
      if (shouldShowEarlyAccess && location.pathname !== "/") {
        throw redirect({ to: "/" });
      }

      const pendingLocale = getPendingSsrLocale();
      if (!pendingLocale) {
        let locale: string | null = null;
        if (import.meta.env.SSR) {
          try {
            const { getCookie } = await import("@tanstack/react-start/server");
            locale = getCookie(cookieName) ?? null;
          } catch {}
        } else {
          locale = readCookieLocale();
        }

        if (
          locale &&
          locale !== fallbackLng &&
          supportedLngs.includes(locale as SupportedLocale) &&
          isPublicPath(location.pathname)
        ) {
          const barePath = location.pathname;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          throw redirect({ href: `/${locale}${barePath}` } as any);
        }
      }
    },
    loader: async () => {
      const shouldShowEarlyAccess = await shouldShowEarlyAccessFn();

      // Dev mode: get current user for dev menu
      let currentUserId: number | null = null;
      if (isDev) {
        currentUserId = await getCurrentUserIdFn();
      }

      const initialLocale = await resolveInitialLocale();

      return { shouldShowEarlyAccess, isDev, currentUserId, initialLocale };
    },
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        ...seo({
          title: "Automaker | by Hugo",
          description:
            "A course to help you learn agentic coding and build real-world projects using AI agents and automation.",
          image: getOgImageUrl(),
        }),
      ],
      links: [
        // Preconnect to Google Fonts for faster font loading
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        // Preload fonts for faster rendering
        {
          rel: "preload",
          as: "style",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
        },
        // Preload CSS for faster discovery
        { rel: "preload", href: appCss, as: "style" },
        { rel: "stylesheet", href: appCss },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
        { rel: "icon", href: "/favicon.ico" },
      ],
      scripts: [
        // Locale detection script - sets lang/dir before page render
        {
          id: "locale-init",
          children: `(function() {
            var LANG_COOKIE = '${cookieName}';
            var DEFAULT_LANG = '${fallbackLng}';
            var RTL_LOCALES = ${JSON.stringify([])};
            var match = document.cookie.match(new RegExp('(?:^|;\\\\s*)' + LANG_COOKIE + '=([^;]*)'));
            var lang = match ? match[1] : DEFAULT_LANG;
            document.documentElement.lang = lang;
            if (RTL_LOCALES.indexOf(lang) !== -1) {
              document.documentElement.dir = 'rtl';
            }
          })();`,
        },
        // Theme detection script - must run before page renders to prevent flash
        {
          id: "theme-init",
          children: `(function() {
            var THEME_COOKIE_NAME = 'ui-theme';
            var COOKIE_EXPIRY_DAYS = 365;
            var MILLISECONDS_PER_DAY = 864e5;
            var DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)';
            var THEME_CLASSES = { LIGHT: 'light', DARK: 'dark' };
            var theme = document.cookie.match(new RegExp('(^| )' + THEME_COOKIE_NAME + '=([^;]+)'))?.[2];
            var resolvedTheme;
            var root = document.documentElement;
            root.classList.remove(THEME_CLASSES.LIGHT, THEME_CLASSES.DARK);
            if (!theme || theme === 'system') {
              resolvedTheme = window.matchMedia(DARK_MODE_MEDIA_QUERY).matches ? THEME_CLASSES.DARK : THEME_CLASSES.LIGHT;
              if (!theme) {
                var expires = new Date(Date.now() + COOKIE_EXPIRY_DAYS * MILLISECONDS_PER_DAY).toUTCString();
                document.cookie = THEME_COOKIE_NAME + '=system; expires=' + expires + '; path=/; SameSite=Lax';
              }
            } else {
              resolvedTheme = theme;
            }
            root.classList.add(resolvedTheme);
            root.setAttribute('data-theme', theme || 'system');
            root.setAttribute('data-resolved-theme', resolvedTheme);
          })();`,
        },
        {
          src: "https://umami-production-101d.up.railway.app/script.js",
          defer: true,
          "data-website-id": "a25b9b45-4772-4642-b752-052c04e52cf5",
        },
      ],
    }),
    errorComponent: (props) => {
      return (
        <RootDocument initialLocale={fallbackLng}>
          <DefaultCatchBoundary {...props} />
        </RootDocument>
      );
    },
    notFoundComponent: () => (
      <RootDocument initialLocale={fallbackLng}>
        <NotFound />
      </RootDocument>
    ),
    component: RootComponent,
  }
);

function RootComponent() {
  useAnalytics();
  const routerState = useRouterState();
  const initialLocale = resolveClientLocale(getPendingSsrLocale());

  // Load Google Analytics scripts client-side only to avoid hydration mismatch
  // (gtag dynamically injects scripts which breaks React hydration)
  React.useEffect(() => {
    // Check if already loaded
    if (document.getElementById("gtag-script")) return;

    // Load gtag.js
    const gtagScript = document.createElement("script");
    gtagScript.id = "gtag-script";
    gtagScript.src =
      "https://www.googletagmanager.com/gtag/js?id=AW-11111910585";
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    // Initialize gtag
    const gtagInit = document.createElement("script");
    gtagInit.id = "gtag-init";
    gtagInit.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-11111910585');
    `;
    document.head.appendChild(gtagInit);
  }, []);

  // Ensure home page starts at top on initial load (prevents scroll restoration issues)
  React.useEffect(() => {
    // Only scroll to top on home page initial load
    if (routerState.location.pathname === "/" && !routerState.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []); // Only run on mount

  return (
    <RootDocument initialLocale={initialLocale}>
      <Outlet />
    </RootDocument>
  );
}

function SeoHreflangLinks({
  initialLocale,
  pathname,
}: {
  initialLocale: string;
  pathname: string;
}) {
  const baseUrl = publicEnv.VITE_HOST_NAME.replace(/\/$/, "");
  const canonicalPath = pathname || "/";

  return (
    <>
      {supportedLngs.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={
            locale === fallbackLng
              ? `${baseUrl}${canonicalPath}`
              : `${baseUrl}/${locale}${canonicalPath}`
          }
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}${canonicalPath}`}
      />
      <meta property="og:locale" content={localeToOgLocale(initialLocale)} />
      {supportedLngs
        .filter((l) => l !== initialLocale)
        .map((altLocale) => (
          <meta
            key={altLocale}
            property="og:locale:alternate"
            content={localeToOgLocale(altLocale)}
          />
        ))}
    </>
  );
}

function RootDocument({
  children,
  initialLocale = fallbackLng,
}: {
  children: React.ReactNode;
  initialLocale?: string;
}) {
  const routerState = useRouterState();
  const loaderData = Route.useLoaderData();
  const shouldShowEarlyAccess = loaderData?.shouldShowEarlyAccess ?? false;
  const bannerMessage = publicEnv.VITE_BANNER_MESSAGE;
  const showBanner = !!bannerMessage;
  const showDevMenu = loaderData?.isDev ?? false;
  const currentUserId = loaderData?.currentUserId ?? null;

  const showFooter =
    !routerState.location.pathname.startsWith("/learn") &&
    !routerState.location.pathname.startsWith("/admin") &&
    !routerState.location.pathname.startsWith("/unsubscribe") &&
    !shouldShowEarlyAccess;
  const showHeader =
    !routerState.location.pathname.startsWith("/learn") &&
    !routerState.location.pathname.startsWith("/admin") &&
    !routerState.location.pathname.startsWith("/unsubscribe") &&
    !shouldShowEarlyAccess;
  const showThemeToggle =
    routerState.location.pathname === "/" && shouldShowEarlyAccess;

  const prevPathnameRef = React.useRef("");

  React.useEffect(() => {
    const currentPathname = routerState.location.pathname;
    const pathnameChanged = prevPathnameRef.current !== currentPathname;

    if (pathnameChanged && routerState.status === "pending") {
      NProgress.start();
      prevPathnameRef.current = currentPathname;
    }

    if (routerState.status === "idle") {
      NProgress.done();
    }
  }, [routerState.status, routerState.location.pathname]);

  return (
    <html
      className="font-inter"
      lang={initialLocale}
      dir={isRtl(initialLocale) ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
        <SeoHreflangLinks
          initialLocale={initialLocale}
          pathname={routerState.location.pathname}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <I18nProvider
          initialLocale={initialLocale as SupportedLocale}
        >
          <ThemeProvider>
            {/* Configurable banner */}
            {showBanner && (
              <div className="fixed top-0 left-0 right-0 z-[60] bg-yellow-500 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 border-b border-yellow-600 dark:border-yellow-700">
                <div className="container mx-auto px-4 py-2 text-center text-sm font-medium">
                  {bannerMessage}
                </div>
              </div>
            )}
            {showHeader && <Header hasBanner={showBanner} />}
            <main
              className={`overflow-x-hidden flex-1 ${
                showHeader
                  ? showBanner
                    ? "mt-[104px]"
                    : "mt-16"
                  : showBanner
                    ? "mt-[40px]"
                    : ""
              }`}
            >
              {children}
            </main>
            {showFooter && <FooterSection />}
            {showThemeToggle && (
              <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
              </div>
            )}
            <ThemedToaster />
            {showDevMenu && (
              <Suspense fallback={null}>
                <DevFloatingMenu currentUserId={currentUserId} />
              </Suspense>
            )}
            {/* <TanStackRouterDevtools position="bottom-right" />
            <ReactQueryDevtools buttonPosition="bottom-left" /> */}
            <Scripts />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
