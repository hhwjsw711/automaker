import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getBlogPostsFn, deleteBlogPostFn } from "~/fn/blog";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
} from "lucide-react";
import { queryOptions } from "@tanstack/react-query";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { PageHeader } from "../-components/page-header";
import { AppCard } from "~/components/app-card";
import { Page } from "../-components/page";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/blog/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(blogPostsQuery);
  },
  component: AdminBlog,
});

const blogPostsQuery = queryOptions({
  queryKey: ["admin", "blog-posts"],
  queryFn: () => getBlogPostsFn({ data: {} }),
});

function AdminBlog() {
  const { t } = useTranslation();
  const { data: blogPosts, isLoading } = useQuery(blogPostsQuery);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteBlogPostFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blog-posts"] });
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    },
  });

  const handleDeleteClick = (post: { id: number; title: string }) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
      deleteMutation.mutate({ data: { id: postToDelete.id } });
    }
  };

  const filteredPosts = blogPosts?.filter((post) => {
    if (filter === "published") return post.isPublished;
    if (filter === "draft") return !post.isPublished;
    return true;
  });

  return (
    <TooltipProvider>
      <Page>
        <PageHeader
          title={t("admin_pages.blogAdmin.blogManagement")}
          highlightedWord={t("admin_pages.blogAdmin.blog")}
          description={t("admin_pages.blogAdmin.blogManagementDescription")}
          actions={
            <Link to="/admin/blog/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t("admin_pages.blogAdmin.newPost")}
              </Button>
            </Link>
          }
        />

        <div
        >
          <Tabs
            value={filter}
            onValueChange={(value) =>
              setFilter(value as "all" | "published" | "draft")
            }
            className="mb-6"
          >
            <TabsList>
              <TabsTrigger value="all">{t("admin_pages.blogAdmin.allPosts")}</TabsTrigger>
              <TabsTrigger value="published">{t("admin_pages.blogAdmin.published")}</TabsTrigger>
              <TabsTrigger value="draft">{t("admin_pages.blogAdmin.drafts")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <AppCard
          icon={FileText}
          iconColor="blue"
          title={t("admin_pages.blogAdmin.blogPosts")}
          description={t("admin_pages.blogAdmin.manageAllBlogPosts")}
        >
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-2">
                    <div className="h-5 w-48 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-foreground">
                        {post.title}
                      </h3>
                      <Badge
                        variant={post.isPublished ? "default" : "secondary"}
                        className={post.isPublished ? "bg-green-500" : ""}
                      >
                        {post.isPublished ? t("admin_pages.blogAdmin.published") : t("admin_pages.blogAdmin.draft")}
                      </Badge>
                    </div>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {post.isPublished && post.publishedAt
                        ? `${t("admin_pages.blogAdmin.publishedAt")} ${new Date(post.publishedAt).toLocaleDateString()}`
                        : `${t("admin_pages.blogAdmin.createdAt")} ${new Date(post.createdAt).toLocaleDateString()}`}
                      {post.author?.displayName &&
                        ` ${t("admin_pages.blogAdmin.by")} ${post.author.displayName}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.isPublished && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link to="/blog/$slug" params={{ slug: post.slug }}>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("admin_pages.blogAdmin.viewPublishedPost")}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to="/admin/blog/$id/edit"
                          params={{ id: post.id.toString() }}
                        >
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("admin_pages.blogAdmin.editPost")}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() =>
                            handleDeleteClick({
                              id: post.id,
                              title: post.title,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("admin_pages.blogAdmin.deletePost")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {t("admin_pages.blogAdmin.noBlogPostsYet")}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("admin_pages.blogAdmin.createFirstBlogPost")}
              </p>
              <Link to="/admin/blog/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("admin_pages.blogAdmin.createBlogPost")}
                </Button>
              </Link>
            </div>
          )}
        </AppCard>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("admin_pages.blogAdmin.deleteBlogPost")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("admin_pages.blogAdmin.deleteConfirmation", { title: postToDelete?.title })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
                {t("admin_pages.blogAdmin.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? t("admin_pages.blogAdmin.deleting") : t("admin_pages.blogAdmin.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Page>
    </TooltipProvider>
  );
}
