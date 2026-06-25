import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("about.heading")}</h1>
      <p>{t("about.description")}</p>
    </div>
  );
}
