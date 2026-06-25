import { useTranslation } from "react-i18next";

export function PageHeader() {
  const { t } = useTranslation();

  return (
    <div className="bg-card/30 border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-theme-500 to-theme-600 bg-clip-text text-transparent">
            {t("launchKits.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("launchKits.description")}
          </p>
        </div>
      </div>
    </div>
  );
}