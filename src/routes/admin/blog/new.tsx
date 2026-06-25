import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { BlogPostForm } from "./-components/blog-post-form";
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

export const Route = createFileRoute("/admin/blog/new")({
  component: NewBlogPost,
});

function NewBlogPost() {
  const { t } = useTranslation();

  return (
    <Page>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/blog">{t("admin_pages.blogAdmin.blog")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("admin_pages.blogAdmin.createPost")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title={t("admin_pages.blogAdmin.createBlogPostTitle")}
        highlightedWord={t("admin_pages.blogAdmin.create")}
        description={t("admin_pages.blogAdmin.createBlogPostDescription")}
      />
      
      <BlogPostForm />
    </Page>
  );
}
