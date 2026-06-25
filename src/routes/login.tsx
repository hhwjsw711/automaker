import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();

  return (
    <div>
      <a href="/api/login/google">{t("loginStub.googleLogin")}</a>
    </div>
  );
}
