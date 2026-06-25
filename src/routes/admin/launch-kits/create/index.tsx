import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { getAllTagsFn } from "~/fn/launch-kits";
import { assertIsAdminFn } from "~/fn/auth";
import { PageHeader } from "../../-components/page-header";
import { ArrowLeft } from "lucide-react";
import { useCreateLaunchKit } from "./-components/use-create-launch-kit";
import { LaunchKitForm } from "../-components/launch-kit-form";

export const Route = createFileRoute("/admin/launch-kits/create/")({
  beforeLoad: () => assertIsAdminFn(),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData({
      queryKey: ["tags"],
      queryFn: () => getAllTagsFn(),
    });
  },
  component: CreateLaunchKitPage,
});

function CreateLaunchKitPage() {
  const { t } = useTranslation();
  const { form, isLoading, formError, onSubmit, handleTagToggle } =
    useCreateLaunchKit();

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          to="/admin/launch-kits"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("admin_pages.launchKitsAdmin.backToKits")}
        </Link>
        <span>/</span>
        <span className="text-foreground">{t("admin_pages.launchKitsAdmin.createNew")}</span>
      </div>

      <PageHeader
        title={t("admin_pages.launchKitsAdmin.createKit")}
        highlightedWord={t("admin_pages.launchKitsAdmin.createHighlighted")}
        description={t("admin_pages.launchKitsAdmin.createKitDesc")}
      />

      <LaunchKitForm
        form={form}
        isLoading={isLoading}
        formError={formError}
        onSubmit={onSubmit}
        onTagToggle={handleTagToggle}
        submitLabel={t("admin_pages.launchKitsAdmin.createKit")}
        mode="create"
      />
    </div>
  );
}
