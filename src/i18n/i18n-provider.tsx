import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { initI18n } from "./index";
import type { SupportedLocale } from "./settings";
import { fallbackLng } from "./settings";

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: SupportedLocale;
}) {
  const [i18n] = useState(() => initI18n(initialLocale ?? fallbackLng));

  useEffect(() => {
    if (initialLocale && i18n.language !== initialLocale) {
      i18n.changeLanguage(initialLocale);
    }
  }, [initialLocale, i18n]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
