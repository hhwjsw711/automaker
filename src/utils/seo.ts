import { supportedLngs, localeToOgLocale } from "~/i18n/settings";

export const seo = ({
  title,
  description,
  keywords,
  image,
  locale,
}: {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
  locale?: string;
}) => {
  const alternateLocales = locale
    ? supportedLngs.filter((l) => l !== locale)
    : [];

  const tags = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:creator", content: "@tannerlinsley" },
    { name: "twitter:site", content: "@tannerlinsley" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    ...(locale
      ? [
          { property: "og:locale", content: localeToOgLocale(locale) },
          ...alternateLocales.map((l) => ({
            property: "og:locale:alternate",
            content: localeToOgLocale(l),
          })),
        ]
      : []),
    ...(image
      ? [
          { name: "twitter:image", content: image },
          { name: "twitter:card", content: "summary_large_image" },
          { property: "og:image", content: image },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
        ]
      : []),
  ];

  return tags;
};
