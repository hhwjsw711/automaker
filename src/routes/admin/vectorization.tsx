import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Database,
  Loader2,
  Play,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
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
  getVectorizationStatusFn,
  queueVectorizeAllSegmentsFn,
  queueVectorizeSegmentFn,
  cancelVectorizeSegmentFn,
} from "~/fn/vector-search";
import { toast } from "sonner";
import { queryOptions } from "@tanstack/react-query";
import { assertIsAdminFn } from "~/fn/auth";
import { useTranslation } from "react-i18next";

const POLLING_INTERVAL = 5000;

export const Route = createFileRoute("/admin/vectorization")({
  beforeLoad: () => assertIsAdminFn(),
  component: AdminVectorization,
});

const vectorizationQuery = queryOptions({
  queryKey: ["admin", "vectorization", "status"],
  queryFn: () => getVectorizationStatusFn(),
  refetchInterval: POLLING_INTERVAL,
});

type SegmentStatus = Awaited<
  ReturnType<typeof getVectorizationStatusFn>
>["segments"][number];

function AdminVectorization() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(vectorizationQuery);

  const queueAllMutation = useMutation({
    mutationFn: queueVectorizeAllSegmentsFn,
    onSuccess: (result) => {
      if (result.jobsQueued > 0) {
        toast.success(
          t("admin_pages.vectorization.toast.jobsQueued", { count: result.jobsQueued })
        );
      } else {
        toast.info(t("admin_pages.vectorization.toast.noSegmentsNeedVectorization"));
      }
      queryClient.invalidateQueries({
        queryKey: ["admin", "vectorization"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : t("admin_pages.vectorization.toast.failedToQueue")
      );
    },
  });

  const queueSegmentMutation = useMutation({
    mutationFn: queueVectorizeSegmentFn,
    onSuccess: (result) => {
      if (result.job) {
        toast.success(t("admin_pages.vectorization.toast.vectorizationJobQueued"));
      } else {
        toast.info(t("admin_pages.vectorization.toast.vectorizationJobInProgress"));
      }
      queryClient.invalidateQueries({
        queryKey: ["admin", "vectorization"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : t("admin_pages.vectorization.toast.failedToQueueJob")
      );
    },
  });

  const cancelSegmentMutation = useMutation({
    mutationFn: cancelVectorizeSegmentFn,
    onSuccess: (result) => {
      if (result.cancelledCount > 0) {
        toast.success(t("admin_pages.vectorization.toast.jobCancelled"));
      } else {
        toast.info(t("admin_pages.vectorization.toast.noActiveJobToCancel"));
      }
      queryClient.invalidateQueries({
        queryKey: ["admin", "vectorization"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : t("admin_pages.vectorization.toast.failedToCancel")
      );
    },
  });

  const handleVectorizeAll = () => {
    queueAllMutation.mutate({});
  };

  const handleVectorizeSegment = (segmentId: number) => {
    queueSegmentMutation.mutate({ data: { segmentId } });
  };

  const handleCancelSegment = (segmentId: number) => {
    cancelSegmentMutation.mutate({ data: { segmentId } });
  };

  const hasActiveJobs = data?.segments.some((s) => s.activeVectorizeJob);

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
          {t("admin_pages.vectorization.failedToLoad")}
        </div>
      </Page>
    );
  }

  const { segments, modules, stats } = data;

  const segmentsByModule = new Map<
    number,
    { module: (typeof modules)[number]; segments: SegmentStatus[] }
  >();

  modules.forEach((module) => {
    segmentsByModule.set(module.id, {
      module,
      segments: [],
    });
  });

  segments.forEach((segment) => {
    const moduleId = modules.find((m) => m.title === segment.moduleTitle)?.id;
    if (moduleId) {
      const moduleData = segmentsByModule.get(moduleId);
      if (moduleData) {
        moduleData.segments.push(segment);
      }
    }
  });

  const activeJobCount = segments.filter((s) => s.activeVectorizeJob).length;

  return (
    <Page>
      <PageHeader
        title={t("admin_pages.vectorization.title")}
        highlightedWord={t("admin_pages.vectorization.highlightedWord")}
        description={t("admin_pages.vectorization.description")}
        actions={
          <Button
            onClick={handleVectorizeAll}
            disabled={
              queueAllMutation.isPending || stats.needsVectorization === 0
            }
            className="flex items-center gap-2"
          >
            {queueAllMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("admin_pages.vectorization.queueing")}
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {t("admin_pages.vectorization.vectorizeAll")}
              </>
            )}
          </Button>
        }
      />

      {hasActiveJobs && (
        <div className="mb-6 p-4 rounded-lg border border-blue-500/20 bg-blue-500/10 flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <div>
            <p className="font-medium text-blue-600 dark:text-blue-400">
              {t("admin_pages.vectorization.jobsInProgress", { count: activeJobCount })}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("admin_pages.vectorization.statusAutoUpdate")}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin_pages.vectorization.stats.totalSegments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSegments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin_pages.vectorization.stats.withTranscripts")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withTranscripts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin_pages.vectorization.stats.vectorized")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.vectorized}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin_pages.vectorization.stats.needsVectorization")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.needsVectorization}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin_pages.vectorization.stats.totalChunks")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChunks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {Array.from(segmentsByModule.values())
          .filter(({ segments }) => segments.length > 0)
          .sort((a, b) => a.module.order - b.module.order)
          .map(({ module, segments: moduleSegments }) => (
            <Card key={module.id}>
              <CardHeader>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>
                  {t("admin_pages.vectorization.moduleSegments", {
                    segmentCount: moduleSegments.length,
                    vectorizedCount: moduleSegments.filter((s) => s.isVectorized).length,
                  })}
                  {moduleSegments.some((s) => s.activeVectorizeJob) && (
                    <span className="ml-2 text-blue-500">
                      {" "}
                      {t("admin_pages.vectorization.moduleProcessing", {
                        processingCount: moduleSegments.filter((s) => s.activeVectorizeJob).length,
                      })}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {moduleSegments.map((segment) => (
                    <SegmentRow
                      key={segment.id}
                      segment={segment}
                      onVectorize={() => handleVectorizeSegment(segment.id)}
                      onCancel={() => handleCancelSegment(segment.id)}
                      isQueueing={
                        queueSegmentMutation.isPending &&
                        queueSegmentMutation.variables?.data.segmentId ===
                          segment.id
                      }
                      isCancelling={
                        cancelSegmentMutation.isPending &&
                        cancelSegmentMutation.variables?.data.segmentId ===
                          segment.id
                      }
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
  segment: SegmentStatus;
  onVectorize: () => void;
  onCancel: () => void;
  isQueueing: boolean;
  isCancelling: boolean;
}

function SegmentRow({
  segment,
  onVectorize,
  onCancel,
  isQueueing,
  isCancelling,
}: SegmentRowProps) {
  const { t } = useTranslation();
  const isProcessing = segment.activeVectorizeJob;

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-medium">{segment.title}</h3>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {segment.hasTranscript ? (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <FileText className="h-3 w-3" />
              <span>{t("admin_pages.vectorization.hasTranscript")}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>{t("admin_pages.vectorization.noTranscript")}</span>
            </div>
          )}

          {isProcessing ? (
            <div className="flex items-center gap-1 text-blue-500">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>{t("admin_pages.vectorization.vectorizing")}</span>
            </div>
          ) : segment.isVectorized ? (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <Database className="h-3 w-3" />
              <span>{t("admin_pages.vectorization.chunks", { count: segment.chunkCount })}</span>
            </div>
          ) : segment.hasTranscript ? (
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-3 w-3" />
              <span>{t("admin_pages.vectorization.notVectorized")}</span>
            </div>
          ) : null}
        </div>
      </div>
      <div className="ml-4 flex items-center gap-2">
        {isProcessing ? (
          <>
            <Badge variant="outline" className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              {t("admin_pages.vectorization.processing")}
            </Badge>
            <Button
              onClick={onCancel}
              disabled={isCancelling}
              size="sm"
              variant="ghost"
              title={t("admin_pages.vectorization.cancelVectorization")}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {isCancelling ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </Button>
          </>
        ) : segment.needsVectorization ? (
          <Button
            onClick={onVectorize}
            disabled={isQueueing}
            size="sm"
            variant="outline"
          >
            {isQueueing ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                {t("admin_pages.vectorization.queueing")}
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-2" />
                {t("admin_pages.vectorization.vectorize")}
              </>
            )}
          </Button>
        ) : segment.isVectorized ? (
          <>
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {t("admin_pages.vectorization.complete")}
            </Badge>
            <Button
              onClick={onVectorize}
              disabled={isQueueing}
              size="sm"
              variant="ghost"
              title={t("admin_pages.vectorization.reRunVectorization")}
            >
              {isQueueing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>
          </>
        ) : (
          <Badge variant="secondary" className="flex items-center gap-1">
            {t("admin_pages.vectorization.noTranscript")}
          </Badge>
        )}
      </div>
    </div>
  );
}
