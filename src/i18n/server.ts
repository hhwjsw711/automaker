import { getCookie } from "@tanstack/react-start/server";
import { cookieName, fallbackLng, supportedLngs } from "./settings";
import type { SupportedLocale } from "./settings";

export function detectLocaleFromRequest(): SupportedLocale {
  try {
    const cookieLocale = getCookie(cookieName);
    if (cookieLocale && isSupported(cookieLocale)) {
      return cookieLocale;
    }
  } catch {
    // getCookie throws if called outside request context
  }
  return fallbackLng;
}

function isSupported(locale: string): locale is SupportedLocale {
  return supportedLngs.includes(locale as SupportedLocale);
}
