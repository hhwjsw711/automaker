import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/unauthenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
      <LogIn className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">{t("error.unauthenticated")}</h2>
      <p className="text-muted-foreground mb-4">
        {t("error.unauthenticatedDesc")}
      </p>
      <a href="/api/login/google">
        <Button>{t("error.signInGoogle")}</Button>
      </a>
    </div>
  );
}
