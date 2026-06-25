import { createFileRoute, Link } from "@tanstack/react-router";
import { isAdminFn } from "~/fn/auth";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/learn/no-segments")({
  component: RouteComponent,
  loader: async () => {
    const isAdmin = await isAdminFn();
    return { isAdmin };
  },
});

function RouteComponent() {
  const { isAdmin } = Route.useLoaderData();
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">{t("learn.noSegmentsTitle")}</h1>
      <p className="text-lg text-center max-w-2xl">
        {isAdmin
          ? t("learn.noSegmentsAdmin")
          : t("learn.noSegmentsNonAdmin")}
      </p>
      {isAdmin ? (
        <Link
          to="/learn/add"
          className="mt-4 px-4 py-2 bg-theme-500 text-white rounded hover:bg-theme-600"
        >
          {t("learn.createAModule")}
        </Link>
      ) : (
        <Link
          to="/"
          className="mt-4 px-4 py-2 bg-muted text-muted-foreground rounded hover:bg-muted/80"
        >
          {t("learn.backToHome")}
        </Link>
      )}
    </div>
  );
}
