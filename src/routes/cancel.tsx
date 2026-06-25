import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/cancel")({ component: RouteComponent });

function RouteComponent() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4">
      <div className="bg-card p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">{t("cancel.heading")}</h1>
        <p className="mb-4">
          {t("cancel.description")}
        </p>
        <div className="mt-6">
          <a
            href="/purchase"
            className="bg-theme-500 hover:bg-theme-600 text-white font-bold py-2 px-4 rounded"
          >
              {t("cancel.returnToPurchase")}
          </a>
        </div>
      </div>
    </div>
  );
}
