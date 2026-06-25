import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/learn/not-found")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">{t("learn.notFound")}</h1>
      <p className="text-lg">{t("learn.notFoundDesc")}</p>
      <Link to="/">{t("learn.startLearning")}</Link>
    </div>
  );
}
