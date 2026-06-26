import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { fallbackLng, supportedLngs, defaultNS, cookieName } from "./settings";
import en from "./locales/en.json";
import zh from "./locales/zh.json";

export function initI18n(lng?: string) {
  const instance = i18n.createInstance();

  instance
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { [defaultNS]: en },
        zh: { [defaultNS]: zh },
      },
      lng: lng ?? fallbackLng,
      fallbackLng,
      supportedLngs: [...supportedLngs],
      defaultNS,
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["querystring", "cookie", "htmlTag", "navigator"],
        lookupCookie: cookieName,
        lookupQuerystring: "lang",
        caches: ["cookie"],
        cookieMinutes: 365 * 24 * 60,
      },
    });

  return instance;
}

