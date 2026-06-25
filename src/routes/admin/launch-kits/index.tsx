import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  getAllLaunchKitsFn,
  getLaunchKitStatsFn,
  getAllTagsFn,
} from "~/fn/launch-kits";
import { assertIsAdminFn } from "~/fn/auth";
import { PageHeader } from "../-components/page-header";
import { queryOptions } from "@tanstack/react-query";
import { LaunchKitsList } from "./-components/launch-kits-list";
import { DeleteLaunchKitDialog } from "./-components/delete-launch-kit-dialog";
import { useLaunchKitDeletion } from "./-components/use-launch-kit-deletion";
import { Page } from "../-components/page";
import { HeaderStats, HeaderStatCard } from "../-components/header-stats";
import { BarChart3, GitFork, MessageSquare, Tag, Settings } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/launch-kits/")({
  beforeLoad: () => assertIsAdminFn(),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(launchKitsQuery);
    context.queryClient.ensureQueryData(statsQuery);
    context.queryClient.ensureQueryData(tagsQuery);
  },
  component: AdminLaunchKits,
});

const launchKitsQuery = queryOptions({
  queryKey: ["admin", "launch-kits"],
  queryFn: () => getAllLaunchKitsFn({ data: {} }),
});

const statsQuery = queryOptions({
  queryKey: ["admin", "launch-kit-stats"],
  queryFn: () => getLaunchKitStatsFn(),
});

const tagsQuery = queryOptions({
  queryKey: ["launch-kit-tags"],
  queryFn: () => getAllTagsFn(),
});

function AdminLaunchKits() {
  const { t } = useTranslation();
  const { data: launchKits, isLoading: kitsLoading } =
    useQuery(launchKitsQuery);
  const { data: stats, isLoading: statsLoading } = useQuery(statsQuery);
  const { data: tags } = useQuery(tagsQuery);

  const {
    isDialogOpen,
    handleDeleteLaunchKit,
    confirmDeleteLaunchKit,
    closeDialog,
  } = useLaunchKitDeletion();

  return (
    <Page>
      <PageHeader
        title={t("admin_pages.launchKitsAdmin.title")}
        highlightedWord={t("admin_pages.launchKitsAdmin.highlighted")}
        description={t("admin_pages.launchKitsAdmin.description")}
        actions={
          <div className="space-y-4">
            {/* Stats Cards */}
            <HeaderStats columns={4}>
              <HeaderStatCard
                icon={BarChart3}
                iconColor="blue"
                value={stats?.totalKits ?? 0}
                label={t("admin_pages.launchKitsAdmin.totalKits")}
                loading={statsLoading}
              />
              <HeaderStatCard
                icon={GitFork}
                iconColor="green"
                value={stats?.totalClones ?? 0}
                label={t("admin_pages.launchKitsAdmin.clones")}
                loading={statsLoading}
              />
              <HeaderStatCard
                icon={MessageSquare}
                iconColor="orange"
                value={stats?.totalComments ?? 0}
                label={t("admin_pages.launchKitsAdmin.comments")}
                loading={statsLoading}
              />
              <HeaderStatCard
                icon={Tag}
                iconColor="purple"
                value={tags?.length ?? 0}
                label={t("admin_pages.launchKitsAdmin.tags")}
                loading={statsLoading}
              />
            </HeaderStats>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button asChild variant="outline">
                <Link to="/admin/launch-kits/create">
                  <GitFork className="mr-2 h-4 w-4" />
                  {t("admin_pages.launchKitsAdmin.createKit")}
                </Link>
              </Button>
              <Button asChild>
                <Link to="/admin/launch-kits/tags">
                  <Settings className="mr-2 h-4 w-4" />
                  {t("admin_pages.launchKitsAdmin.manageTags")}
                </Link>
              </Button>
            </div>
          </div>
        }
      />

      <LaunchKitsList
        launchKits={launchKits}
        isLoading={kitsLoading}
        onDeleteKit={handleDeleteLaunchKit}
      />

      <DeleteLaunchKitDialog
        open={isDialogOpen}
        onOpenChange={closeDialog}
        onConfirm={confirmDeleteLaunchKit}
      />
    </Page>
  );
}
