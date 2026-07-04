import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Video,
  FileText,
  Image,
  Loader2,
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PageHeader } from "./-components/page-header";
import { Page } from "./-components/page";
import {
  getSegmentsWithProcessingStatusFn,
  queueMissingJobsForAllSegmentsFn,
  queueAllJobsForSegmentFn,
  queueMissingSummaryJobsFn,
  resetProcessingJobsFn,
} from "~/fn/video-processing-jobs";
import { toast } from "sonner";
import { queryOptions } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/admin/video-processing")({
  component: AdminVideoProcessing,
});

const segmentsQuery = queryOptions({
  queryKey: ["admin", "video-processing", "segments"],
  queryFn: () => getSegmentsWithProcessingStatusFn(),
  refetchInterval: 5000,
});

type SegmentWithStatus = Awaited<
  ReturnType<typeof getSegmentsWithProcessingStatusFn>
>["segments"][number];

function AdminVideoProcessing() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(segmentsQuery);
  const [processingSegments, setProcessingSegments] = useState<Set<number>>(
    new Set()
  );

  const queueAllMutation = useMutation({
    mutationFn: queueMissingJobsForAllSegmentsFn,
    onSuccess: (result) => {
      toast.success(
        t("admin_pages.videoProcessing.toast.jobsQueuedForProcessing", { count: result.jobsQueued })
      );
      queryClient.invalidateQueries({
        queryKey: ["admin", "video-processing"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("admin_pages.videoProcessing.toast.failedToQueue")
      );
    },
  });

  const queueSegmentMutation = useMutation({
    mutationFn: queueAllJobsForSegmentFn,
    onSuccess: (result) => {
      toast.success(
        t("admin_pages.videoProcessing.toast.jobsQueuedForSegment", { count: result.jobs.length })
      );
      queryClient.invalidateQueries({
        queryKey: ["admin", "video-processing"],
      });
      setProcessingSegments((prev) => {
        const next = new Set(prev);
        next.delete(result.jobs[0]?.segmentId || 0);
        return next;
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("admin_pages.videoProcessing.toast.failedToQueue")
      );
      setProcessingSegments((prev) => {
        const next = new Set(prev);
        next.delete(0);
        return next;
      });
    },
  });

  const queueSummariesMutation = useMutation({
    mutationFn: queueMissingSummaryJobsFn,
    onSuccess: (result) => {
      toast.success(
        t("admin_pages.videoProcessing.toast.summaryJobsQueued", { count: result.jobsQueued })
      );
      queryClient.invalidateQueries({
        queryKey: ["admin", "video-processing"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("admin_pages.videoProcessing.toast.failedToQueueSummary")
      );
    },
  });

  const resetProcessingMutation = useMutation({
    mutationFn: resetProcessingJobsFn,
    onSuccess: (result) => {
      toast.success(
        t("admin_pages.videoProcessing.toast.jobsReset", { count: result.jobsReset })
      );
      queryClient.invalidateQueries({
        queryKey: ["admin", "video-processing"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("admin_pages.videoProcessing.toast.failedToReset")
      );
    },
  });

  const handleQueueAll = () => {
    queueAllMutation.mutate({});
  };

  const handleQueueSummaries = () => {
    queueSummariesMutation.mutate({});
  };

  const handleResetProcessing = () => {
    resetProcessingMutation.mutate({});
  };

  const handleQueueSegment = (segmentId: number) => {
    setProcessingSegments((prev) => new Set(prev).add(segmentId));
    queueSegmentMutation.mutate({ data: { segmentId } });
  };

  if (isLoading) {
    return (
      <Page>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Page>
    );
  }

  if (!data) {
    return (
      <Page>
        <div className="text-center text-muted-foreground">
          {t("admin_pages.videoProcessing.failedToLoad")}
        </div>
      </Page>
    );
  }

  const { segments, modules } = data;

  const segmentsByModule = new Map<
    number,
    { module: (typeof modules)[number]; segments: SegmentWithStatus[] }
  >();

  modules.forEach((module) => {
    segmentsByModule.set(module.id, {
      module,
      segments: [],
    });
  });

  segments.forEach((segment) => {
    const moduleData = segmentsByModule.get(segment.moduleId);
    if (moduleData) {
      moduleData.segments.push(segment);
    }
  });

  const totalSegments = segments.length;
  const segmentsWithVideo = segments.filter((s) => s.hasVideo).length;
  const segmentsNeedingTranscript = segments.filter(
    (s) => s.needsTranscript && !s.activeTranscriptJob
  ).length;
  const segmentsNeedingTranscode = segments.filter(
    (s) => s.needsTranscode && !s.activeTranscodeJob
  ).length;
  const segmentsNeedingThumbnail = segments.filter(
    (s) => s.needsThumbnail && !s.activeThumbnailJob
  ).length;
  const segmentsNeedingSummary = segments.filter(
    (s) => s.needsSummary && !s.activeSummaryJob
  ).length;

  return (
    <Page>
      <PageHeader
        title={t("admin_pages.videoProcessing.title")}
        highlightedWord={t("admin_pages.videoProcessing.highlightedWord")}
        description={t("admin_pages.videoProcessing.description")}
        actions={
          <div className="flex items-center gap-2">
              <Button
                onClick={handleQueueSummaries}
                disabled={
                  queueSummariesMutation.isPending || segmentsNeedingSummary === 0
                }
                variant="outline"
                className="flex items-center gap-2"
              >
                {queueSummariesMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("admin_pages.videoProcessing.queueing")}
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4" />
                    {t("admin_pages.videoProcessing.generateSummaries")}
                  </>
                )}
              </Button>
              <Button
                onClick={handleResetProcessing}
                disabled={resetProcessingMutation.isPending}
                variant="outline"
                className="flex items-center gap-2"
              >
                {resetProcessingMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("admin_pages.videoProcessing.resetStuckJobs")}
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    {t("admin_pages.videoProcessing.resetStuckJobs")}
                  </>
                )}
              </Button>
              <Button
              onClick={handleQueueAll}
              disabled={
                queueAllMutation.isPending ||
                (segmentsNeedingTranscript === 0 &&
                  segmentsNeedingTranscode === 0 &&
                  segmentsNeedingThumbnail === 0)
              }
              className="flex items-center gap-2"
            >
              {queueAllMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("admin_pages.videoProcessing.queueing")}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  {t("admin_pages.videoProcessing.processAllMissing")}
                </>
              )}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin_pages.videoProcessing.stats.totalSegments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSegments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin_pages.videoProcessing.stats.segmentsWithVideo")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{segmentsWithVideo}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin_pages.videoProcessing.stats.needTranscript")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {segmentsNeedingTranscript}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin_pages.videoProcessing.stats.needTranscode")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{segmentsNeedingTranscode}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin_pages.videoProcessing.stats.needThumbnail")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{segmentsNeedingThumbnail}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin_pages.videoProcessing.stats.needSummary")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{segmentsNeedingSummary}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {Array.from(segmentsByModule.values())
          .sort((a, b) => a.module.order - b.module.order)
          .map(({ module, segments: moduleSegments }) => (
            <Card key={module.id}>
              <CardHeader>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>
                  {t("admin_pages.videoProcessing.segments", { count: moduleSegments.length })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {moduleSegments
                    .sort((a, b) => a.order - b.order)
                    .map((segment) => (
                      <SegmentRow
                        key={segment.id}
                        segment={segment}
                        onProcess={() => handleQueueSegment(segment.id)}
                        isProcessing={processingSegments.has(segment.id)}
                      />
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </Page>
  );
}

interface SegmentRowProps {
  segment: SegmentWithStatus;
  onProcess: () => void;
  isProcessing: boolean;
}

function SegmentRow({ segment, onProcess, isProcessing }: SegmentRowProps) {
  const { t } = useTranslation();
  const needsProcessing =
    (segment.needsTranscript && !segment.activeTranscriptJob) ||
    (segment.needsTranscode && !segment.activeTranscodeJob) ||
    (segment.needsThumbnail && !segment.activeThumbnailJob) ||
    (segment.needsSummary && !segment.activeSummaryJob);

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-medium">{segment.title}</h3>
          {segment.isPremium && (
            <Badge variant="secondary" className="text-xs">
              {t("admin_pages.videoProcessing.premium")}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <StatusBadge
            icon={Video}
            label={t("admin_pages.videoProcessing.status.video")}
            has={segment.hasVideo}
            active={false}
          />
          <StatusBadge
            icon={FileText}
            label={t("admin_pages.videoProcessing.status.transcript")}
            has={segment.hasTranscript}
            active={segment.activeTranscriptJob}
            needs={segment.needsTranscript}
          />
          <StatusBadge
            icon={Video}
            label={t("admin_pages.videoProcessing.status.720p")}
            has={segment.has720p}
            active={segment.activeTranscodeJob}
            needs={segment.needsTranscode}
          />
          <StatusBadge
            icon={Video}
            label={t("admin_pages.videoProcessing.status.480p")}
            has={segment.has480p}
            active={segment.activeTranscodeJob}
            needs={segment.needsTranscode}
          />
          <StatusBadge
            icon={Image}
            label={t("admin_pages.videoProcessing.status.thumb")}
            has={segment.hasThumbnail}
            active={segment.activeThumbnailJob}
            needs={segment.needsThumbnail}
          />
          <StatusBadge
            icon={BookOpen}
            label={t("admin_pages.videoProcessing.status.summary")}
            has={segment.hasSummary}
            active={segment.activeSummaryJob}
            needs={segment.needsSummary}
          />
        </div>
      </div>
      <div className="ml-4">
        {needsProcessing ? (
          <Button
            onClick={onProcess}
            disabled={isProcessing}
            size="sm"
            variant="outline"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                {t("admin_pages.videoProcessing.queueing")}
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-2" />
                {t("admin_pages.videoProcessing.process")}
              </>
            )}
          </Button>
        ) : segment.activeTranscriptJob ||
          segment.activeTranscodeJob ||
          segment.activeThumbnailJob ||
          segment.activeSummaryJob ? (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            {t("admin_pages.videoProcessing.processing")}
          </Badge>
        ) : (
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {t("admin_pages.videoProcessing.complete")}
          </Badge>
        )}
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  has: boolean;
  active: boolean;
  needs?: boolean;
}

function StatusBadge({
  icon: Icon,
  label,
  has,
  active,
  needs,
}: StatusBadgeProps) {
  if (active) {
    return (
      <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>{label}</span>
      </div>
    );
  }

  if (has) {
    return (
      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
        <CheckCircle2 className="h-3 w-3" />
        <span>{label}</span>
      </div>
    );
  }

  if (needs) {
    return (
      <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
        <AlertCircle className="h-3 w-3" />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <XCircle className="h-3 w-3" />
      <span>{label}</span>
    </div>
  );
}
