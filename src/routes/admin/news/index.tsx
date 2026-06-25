import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { assertIsAdminFn } from "~/fn/auth";
import {
  getNewsEntriesWithTagsFn,
  deleteNewsEntryFn,
  getAllNewsTagsFn,
} from "~/fn/news";
import { PageHeader } from "../-components/page-header";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Plus,
  Trash2,
  ExternalLink,
  Video,
  FileText,
  Newspaper,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Page } from "../-components/page";
import { MarkdownRenderer } from "~/components/markdown-renderer";

// Maximum characters to show in markdown preview
const MARKDOWN_PREVIEW_MAX_LENGTH = 600;

export const Route = createFileRoute("/admin/news/")({
  beforeLoad: () => assertIsAdminFn(),
  component: AdminNewsPage,
});

function AdminNewsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateMarkdown = (content: string): string => {
    if (content.length <= MARKDOWN_PREVIEW_MAX_LENGTH) {
      return content;
    }
    // Truncate at the last space before the limit to avoid cutting words
    const truncated = content.substring(0, MARKDOWN_PREVIEW_MAX_LENGTH);
    const lastSpace = truncated.lastIndexOf(" ");
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + "..." : truncated + "...";
  };

  const { data: newsEntries, isLoading } = useQuery({
    queryKey: ["admin", "news-entries"],
    queryFn: () => getNewsEntriesWithTagsFn(),
  });

  const { data: availableTags } = useQuery({
    queryKey: ["news-tags"],
    queryFn: () => getAllNewsTagsFn(),
  });

  const deleteEntryMutation = useMutation({
    mutationFn: (id: number) => deleteNewsEntryFn({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "news-entries"] });
    },
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "blog":
        return <FileText className="h-4 w-4" />;
      case "changelog":
        return <Newspaper className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      case "blog":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "changelog":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <Page>
        <PageHeader
          title={t("admin_pages.newsAdmin.newsManagement")}
          highlightedWord={t("admin_pages.newsAdmin.news")}
          description={t("admin_pages.newsAdmin.newsManagementDescription")}
        />
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title={t("admin_pages.newsAdmin.newsManagement")}
        highlightedWord={t("admin_pages.newsAdmin.news")}
        description={t("admin_pages.newsAdmin.newsManagementDescription")}
        actions={
          <div className="flex items-end gap-2 self-end">
            <Button variant="outline" asChild>
              <Link to="/news">
                <Eye className="h-4 w-4 mr-2" />
                {t("admin_pages.newsAdmin.viewNewsPage")}
              </Link>
            </Button>
            <Button asChild className="self-end">
              <Link to="/admin/news/new">
                <Plus className="h-4 w-4 mr-2" />
                {t("admin_pages.newsAdmin.addNewsEntry")}
              </Link>
            </Button>
          </div>
        }
      />

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{newsEntries?.length || 0} {t("admin_pages.newsAdmin.entries")}</Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {newsEntries?.map((entry) => (
          <Card
            key={entry.id}
            className="group hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={getTypeColor(entry.type)}
                    >
                      {getTypeIcon(entry.type)}
                      <span className="ml-1 capitalize">{t(`admin_pages.newsAdmin.type${entry.type.charAt(0).toUpperCase()}${entry.type.slice(1)}`)}</span>
                    </Badge>

                    {!entry.isPublished && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                      >
                        <EyeOff className="h-3 w-3 mr-1" />
                        {t("admin_pages.newsAdmin.draft")}
                      </Badge>
                    )}

                    {entry.isPublished && (
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-600 dark:text-green-400"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        {t("admin_pages.newsAdmin.published")}
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="text-lg mb-1">
                    <Link
                      to={`/admin/news/${entry.id}/edit` as any}
                      className="hover:text-theme-600 dark:hover:text-theme-400 transition-colors"
                    >
                      {entry.title}
                    </Link>
                  </CardTitle>

                  {entry.description && (
                    <div className="text-sm text-muted-foreground mt-2">
                      <MarkdownRenderer
                        content={truncateMarkdown(entry.description)}
                        className="prose-sm prose-headings:text-sm prose-p:text-sm prose-p:my-1 prose-ul:text-sm prose-ol:text-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {t("admin_pages.newsAdmin.openExternalLink")}
                    </a>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent animation="slide-right">
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("admin_pages.newsAdmin.deleteNewsEntry")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("admin_pages.newsAdmin.deleteNewsEntryConfirmation", { title: entry.title })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("admin_pages.newsAdmin.cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteEntryMutation.mutate(entry.id)}
                          variant="destructive"
                        >
                          {t("admin_pages.newsAdmin.delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{t("admin_pages.newsAdmin.publishedAt")} {formatDate(entry.publishedAt)}</span>
                  </div>

                  {entry.authorName && <span>{t("admin_pages.newsAdmin.by")} {entry.authorName}</span>}
                </div>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    {entry.tags.map((tag: any) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: tag.color,
                          color: tag.color,
                        }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {newsEntries?.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t("admin_pages.newsAdmin.noNewsEntries")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("admin_pages.newsAdmin.noNewsEntriesDescription")}
              </p>
              <Button asChild>
                <Link to="/admin/news/new">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("admin_pages.newsAdmin.addFirstEntry")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Page>
  );
}
