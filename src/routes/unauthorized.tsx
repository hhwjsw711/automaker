import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/unauthorized")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
      <h2 className="text-2xl font-semibold mb-2">{t("error.unauthorized")}</h2>
      <p className="text-muted-foreground mb-4">
        {t("error.unauthorizedDesc")}
      </p>
      <Button onClick={() => navigate({ to: "/" })}>{t("error.goHome")}</Button>
    </div>
  );
}
