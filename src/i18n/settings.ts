export const fallbackLng = "en";

export const supportedLngs = ["en", "zh"] as const;
export type SupportedLocale = (typeof supportedLngs)[number];

export const localeNames: Record<SupportedLocale, string> = {
  en: "English",
  zh: "中文",
};

export const localeFlags: Record<SupportedLocale, string> = {
  en: "🇺🇸",
  zh: "🇨🇳",
};

export const rtlLocales: SupportedLocale[] = [];

export function isRtl(locale: string): boolean {
  return rtlLocales.includes(locale as SupportedLocale);
}

export const defaultNS = "translation";
export const cookieName = "lang";
