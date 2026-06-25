import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { assertIsAdminFn } from "~/fn/auth";
import { NewsEntryForm } from "../../-components/news-entry-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllNewsTagsFn, getNewsEntryByIdFn } from "~/fn/news";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Page } from "../../-components/page";
import { PageHeader } from "../../-components/page-header";

export const Route = createFileRoute("/admin/news/$id/edit")({
  beforeLoad: () => assertIsAdminFn(),
  component: EditNewsEntry,
});

function EditNewsEntry() {
  const { id } = Route.useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: entry, isLoading: isLoadingEntry } = useQuery({
    queryKey: ["news-entry", id],
    queryFn: () => getNewsEntryByIdFn({ data: { id: Number(id) } }),
  });

  const { data: availableTags, isLoading: isLoadingTags } = useQuery({
    queryKey: ["news-tags"],
    queryFn: () => getAllNewsTagsFn(),
  });

  const isLoading = isLoadingEntry || isLoadingTags;

  if (isLoading) {
    return (
      <Page>
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/news">{t("admin_pages.newsAdmin.news")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("admin_pages.newsAdmin.editEntry")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PageHeader
          title={t("admin_pages.newsAdmin.editNewsEntryTitle")}
          highlightedWord={t("admin_pages.newsAdmin.news")}
          description={t("admin_pages.newsAdmin.editNewsEntryDescription")}
        />

        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded mb-4"></div>
          <div className="h-20 bg-muted rounded mb-4"></div>
          <div className="h-10 bg-muted rounded mb-4"></div>
        </div>
      </Page>
    );
  }

  if (!entry) {
    return (
      <Page>
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/news">{t("admin_pages.newsAdmin.news")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("admin_pages.newsAdmin.editEntry")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PageHeader
          title={t("admin_pages.newsAdmin.entryNotFound")}
          highlightedWord={t("admin_pages.newsAdmin.notFound")}
          description={t("admin_pages.newsAdmin.entryNotFoundDescription")}
        />
      </Page>
    );
  }

  return (
    <Page>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/news">{t("admin_pages.newsAdmin.news")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("admin_pages.newsAdmin.editEntry")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title={t("admin_pages.newsAdmin.editNewsEntryTitle")}
        highlightedWord={t("admin_pages.newsAdmin.news")}
        description={t("admin_pages.newsAdmin.editNewsEntryDescription")}
      />

      <div className="max-w-2xl">
        <NewsEntryForm
          entry={entry}
          availableTags={availableTags || []}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: ["admin", "news-entries"],
            });
            navigate({ to: "/admin/news" });
          }}
        />
      </div>
    </Page>
  );
}
