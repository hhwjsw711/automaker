import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { assertIsAdminFn } from "~/fn/auth";
import { NewsEntryForm } from "../-components/news-entry-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllNewsTagsFn } from "~/fn/news";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Page } from "../-components/page";
import { PageHeader } from "../-components/page-header";

export const Route = createFileRoute("/admin/news/new")({
  beforeLoad: () => assertIsAdminFn(),
  component: NewNewsEntry,
});

function NewNewsEntry() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: availableTags, isLoading } = useQuery({
    queryKey: ["news-tags"],
    queryFn: () => getAllNewsTagsFn(),
  });

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
              <BreadcrumbPage>{t("admin_pages.newsAdmin.addEntry")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PageHeader
          title={t("admin_pages.newsAdmin.addNewsEntryTitle")}
          highlightedWord={t("admin_pages.newsAdmin.news")}
          description={t("admin_pages.newsAdmin.addNewsEntryDescription")}
        />

        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded mb-4"></div>
          <div className="h-20 bg-muted rounded mb-4"></div>
          <div className="h-10 bg-muted rounded mb-4"></div>
        </div>
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
            <BreadcrumbPage>{t("admin_pages.newsAdmin.addEntry")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title={t("admin_pages.newsAdmin.addNewsEntryTitle")}
        highlightedWord={t("admin_pages.newsAdmin.news")}
        description={t("admin_pages.newsAdmin.addNewsEntryDescription")}
      />

      <div className="max-w-2xl">
        <NewsEntryForm
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
