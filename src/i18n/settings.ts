export const fallbackLng = "en";

export const supportedLngs = ["en", "zh", "zh-TW"] as const;
export type SupportedLocale = (typeof supportedLngs)[number];

export const localeNames: Record<SupportedLocale, string> = {
  en: "English",
  zh: "中文（简体）",
  "zh-TW": "中文（繁體）",
};

export const localeFlags: Record<SupportedLocale, string> = {
  en: "🇺🇸",
  zh: "🇨🇳",
  "zh-TW": "🇹🇼",
};

export const rtlLocales: SupportedLocale[] = [];

export function isRtl(locale: string): boolean {
  return rtlLocales.includes(locale as SupportedLocale);
}

export const defaultNS = "translation";
export const cookieName = "lang";

export function localeToOgLocale(locale: string): string {
  if (locale === "zh") return "zh_CN";
  if (locale === "zh-TW") return "zh_TW";
  if (locale === "en") return "en_US";
  return locale;
}
