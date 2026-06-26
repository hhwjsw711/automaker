import { useTranslation } from "react-i18next";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { supportedLngs, localeNames, localeFlags, type SupportedLocale } from "~/i18n/settings";
import { cn } from "~/lib/utils";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { location } = useRouterState();

  const currentLocale = i18n.language?.split("-")[0] ?? "en";
  const supportedLocale = supportedLngs.includes(currentLocale as SupportedLocale)
    ? currentLocale
    : "en";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t("common.language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {supportedLngs.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => {
              i18n.changeLanguage(locale);
              navigate({ to: location.pathname, replace: true });
            }}
            className={cn(
              "flex items-center gap-2",
              locale === supportedLocale && "font-semibold"
            )}
          >
            <span>{localeFlags[locale]}</span>
            <span>{localeNames[locale]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
