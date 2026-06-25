import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { getAllTagsFn, getLaunchKitByIdFn } from "~/fn/launch-kits";
import { assertIsAdminFn } from "~/fn/auth";
import { PageHeader } from "../../-components/page-header";
import { ArrowLeft } from "lucide-react";
import { useEditLaunchKit } from "./-components/use-edit-launch-kit";
import { LaunchKitForm } from "../-components/launch-kit-form";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/launch-kits/edit/$id")({
  beforeLoad: () => assertIsAdminFn(),
  loader: async ({ context, params }) => {
    // Load tags for the form
    context.queryClient.ensureQueryData({
      queryKey: ["tags"],
      queryFn: () => getAllTagsFn(),
    });

    // Load launch kit data for editing
    context.queryClient.ensureQueryData({
      queryKey: ["admin", "launch-kit", params.id],
      queryFn: () => getLaunchKitByIdFn({ data: { id: parseInt(params.id) } }),
    });
  },
  component: EditLaunchKitPage,
});

function EditLaunchKitPage() {
  const { t } = useTranslation();
  const { id } = Route.useParams();

  // Get launch kit data
  const { data: launchKit, isLoading: isLoadingKit } = useQuery({
    queryKey: ["admin", "launch-kit", id],
    queryFn: () => getLaunchKitByIdFn({ data: { id: parseInt(id) } }),
    refetchOnWindowFocus: false,
  });

  const { form, isLoading, formError, onSubmit, handleTagToggle } =
    useEditLaunchKit(launchKit);

  if (isLoadingKit) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!launchKit) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t("admin_pages.launchKitsAdmin.kitNotFound")}</p>
      </div>
    );
  }

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
        <span className="text-foreground">{t("admin_pages.launchKitsAdmin.editBreadcrumb", { name: launchKit.name })}</span>
      </div>

      <PageHeader
        title={t("admin_pages.launchKitsAdmin.editKit")}
        highlightedWord={t("admin_pages.launchKitsAdmin.editHighlighted")}
        description={t("admin_pages.launchKitsAdmin.editKitDesc", { name: launchKit.name })}
      />

      <LaunchKitForm
        form={form}
        isLoading={isLoading}
        formError={formError}
        onSubmit={onSubmit}
        onTagToggle={handleTagToggle}
        submitLabel={t("admin_pages.launchKitsAdmin.updateKit")}
        mode="edit"
      />
    </div>
  );
}
