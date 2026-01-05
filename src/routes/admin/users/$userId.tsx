import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { assertIsAdminFn } from "~/fn/auth";
import { getAdminUserAnalyticsFn } from "~/fn/admin-users";
import { PageHeader } from "~/routes/admin/-components/page-header";
import { Page } from "~/routes/admin/-components/page";
import {
  HeaderStats,
  HeaderStatCard,
} from "~/routes/admin/-components/header-stats";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import {
  Crown,
  User,
  UserCheck,
  Mail,
  PlayCircle,
  MessageSquare,
  Download,
  Calendar,
  ArrowLeft,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

export const Route = createFileRoute("/admin/users/$userId")({
  beforeLoad: () => assertIsAdminFn(),
  loader: ({ context, params }) => {
    const userId = Number(params.userId);
    context.queryClient.ensureQueryData(userAnalyticsQuery(userId));
  },
  component: AdminUserDetail,
});

const userAnalyticsQuery = (userId: number) =>
  queryOptions({
    queryKey: ["admin", "user-analytics", userId],
    queryFn: () => getAdminUserAnalyticsFn({ data: { userId } }),
  });

function AdminUserDetail() {
  const { userId } = Route.useParams();
  const userIdNum = Number(userId);
  const { data, isLoading } = useQuery(userAnalyticsQuery(userIdNum));

  if (isLoading) {
    return (
      <Page>
        <div className="animate-pulse space-y-8">
          <div className="h-12 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </Page>
    );
  }

  if (!data) {
    return (
      <Page>
        <div className="text-center py-16">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">User not found</h2>
          <Link to="/admin/users">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>
      </Page>
    );
  }

  const { user, progress, comments, downloadStats } = data;
  const profile = user.profile;

  const getUserInitials = (displayName?: string | null, email?: string | null) => {
    if (displayName) {
      return displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserAvatar = () => {
    if (profile?.image) {
      return profile.image;
    }
    const initials = getUserInitials(profile?.displayName, user.email);
    return `https://api.dicebear.com/9.x/initials/svg?seed=${initials}&backgroundColor=6366f1&textColor=ffffff`;
  };

  const isHighDownloader = downloadStats.totalDownloads > 50;
  const downloadRatio =
    downloadStats.uniqueVideos > 0
      ? downloadStats.totalDownloads / downloadStats.uniqueVideos
      : 0;
  const isSuspicious = downloadRatio > 10 || downloadStats.totalDownloads > 100;

  return (
    <Page>
      <Link to="/admin/users" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Users
      </Link>

      <PageHeader
        title="User Analytics"
        highlightedWord="Analytics"
        description={
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
              <AvatarImage src={getUserAvatar()} alt={profile?.displayName || user.email || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {getUserInitials(profile?.displayName, user.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-foreground">
                {profile?.displayName || "No name"}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-3 w-3" />
                {user.email}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Badge
                variant={user.isPremium ? "default" : "secondary"}
                className={
                  user.isPremium
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 border-0"
                    : ""
                }
              >
                {user.isPremium ? (
                  <>
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3 mr-1" />
                    Free
                  </>
                )}
              </Badge>
              {user.isAdmin && (
                <Badge variant="destructive">
                  <UserCheck className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
              {isSuspicious && (
                <Badge variant="destructive" className="animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Suspicious Activity
                </Badge>
              )}
            </div>
          </div>
        }
        actions={
          <HeaderStats columns={4}>
            <HeaderStatCard
              icon={PlayCircle}
              iconColor="green"
              value={progress.length}
              label="Videos Completed"
              loading={isLoading}
            />
            <HeaderStatCard
              icon={MessageSquare}
              iconColor="blue"
              value={comments.length}
              label="Comments"
              loading={isLoading}
            />
            <HeaderStatCard
              icon={Download}
              iconColor={isSuspicious ? "red" : "purple"}
              value={downloadStats.totalDownloads}
              label="Total Downloads"
              loading={isLoading}
            />
            <HeaderStatCard
              icon={PlayCircle}
              iconColor="cyan"
              value={downloadStats.uniqueVideos}
              label="Unique Videos"
              loading={isLoading}
            />
          </HeaderStats>
        }
      />

      <Tabs defaultValue="downloads" className="space-y-6">
        <TabsList>
          <TabsTrigger value="downloads" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Downloads
            {isSuspicious && <AlertTriangle className="h-3 w-3 text-destructive" />}
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            Progress
            <Badge variant="secondary" className="ml-1">{progress.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments
            <Badge variant="secondary" className="ml-1">{comments.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="downloads" className="space-y-6">
          {isSuspicious && (
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <div>
                    <div className="font-semibold text-destructive">Suspicious Download Activity</div>
                    <div className="text-sm text-muted-foreground">
                      This user has downloaded {downloadStats.totalDownloads} videos ({downloadStats.uniqueVideos} unique).
                      Average {downloadRatio.toFixed(1)} downloads per unique video.
                      {downloadStats.premiumDownloads > 0 && ` ${downloadStats.premiumDownloads} premium video downloads.`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Download Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Total Downloads</span>
                  <span className="font-semibold">{downloadStats.totalDownloads}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Unique Videos</span>
                  <span className="font-semibold">{downloadStats.uniqueVideos}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Premium Downloads</span>
                  <span className="font-semibold">{downloadStats.premiumDownloads}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Avg. per Video</span>
                  <span className="font-semibold">{downloadRatio.toFixed(1)}x</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Most Downloaded Videos</CardTitle>
              </CardHeader>
              <CardContent>
                {downloadStats.mostDownloaded.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No downloads yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {downloadStats.mostDownloaded.map((item) => (
                      <div key={item.segmentId} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.segment?.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.segment?.module?.title}
                          </div>
                        </div>
                        <Badge variant={item.count > 5 ? "destructive" : "secondary"}>
                          {item.count}x
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              {downloadStats.recentDownloads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No downloads recorded
                </div>
              ) : (
                <div className="space-y-2">
                  {downloadStats.recentDownloads.map((download) => (
                    <div key={download.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{download.segment?.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {download.segment?.module?.title}
                            {download.segment?.isPremium && (
                              <Badge variant="outline" className="ml-2 text-xs">Premium</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(download.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Completed Videos</CardTitle>
            </CardHeader>
            <CardContent>
              {progress.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No videos completed yet
                </div>
              ) : (
                <div className="space-y-2">
                  {progress.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="font-medium">{p.segment?.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.segment?.module?.title}
                            {p.segment?.length && (
                              <span className="ml-2">({p.segment.length})</span>
                            )}
                            {p.segment?.isPremium && (
                              <Badge variant="outline" className="ml-2 text-xs">Premium</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Comments</CardTitle>
            </CardHeader>
            <CardContent>
              {comments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No comments yet
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          to="/learn/$slug"
                          params={{ slug: comment.segment?.slug || "" }}
                          className="text-sm font-medium hover:text-theme-500"
                        >
                          {comment.segment?.title}
                        </Link>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {comment.content}
                      </div>
                      {comment.children && comment.children.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-2">
                          {comment.children.length} {comment.children.length === 1 ? "reply" : "replies"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Page>
  );
}
