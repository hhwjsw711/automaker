import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Video, BookOpen, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { VideoSource } from "~/hooks/use-rag-chat";

interface SourceVideosPanelProps {
  sources: VideoSource[];
}

export function SourceVideosPanel({ sources }: SourceVideosPanelProps) {
  const { t } = useTranslation();

  if (sources.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("admin_pages.vectorSearch.sourceVideos")}</CardTitle>
          <CardDescription>
            {t("admin_pages.vectorSearch.relevantVideosAppearHere")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Video className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {t("admin_pages.vectorSearch.askToSeeRelatedVideos")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("admin_pages.vectorSearch.sourceVideos")}</CardTitle>
        <CardDescription>
          {t("admin_pages.vectorSearch.videosFoundRelevant", { count: sources.length })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {sources.map((source) => (
          <div
            key={source.segmentId}
            className="rounded-lg border p-3 space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Video className="h-3.5 w-3.5 text-theme-500 shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {source.segmentTitle}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3 shrink-0" />
                  <span className="truncate">{source.moduleTitle}</span>
                </div>
              </div>
              <Badge
                variant={
                  source.similarity > 0.8
                    ? "default"
                    : source.similarity > 0.6
                      ? "secondary"
                      : "outline"
                }
                className="shrink-0"
              >
                {(source.similarity * 100).toFixed(0)}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {source.chunkText}
            </p>
            <Link
              to="/learn/$slug"
              params={{ slug: source.segmentSlug }}
              className="inline-flex items-center gap-1 text-xs text-theme-500 hover:text-theme-600 hover:underline"
            >
              {t("admin_pages.vectorSearch.goToVideo")}
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
