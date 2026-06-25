import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getRecentSegmentsForNotificationFn,
  getSegmentNotificationRecipientsCountFn,
  sendSegmentNotificationBatchFn,
  getEmailBatchesFn,
  sendTestSegmentNotificationFn,
} from "~/fn/emails";
import { SegmentSelector } from "./-components/segment-selector";
import { SegmentNotificationPanel } from "./-components/segment-notification-panel";
import { TestEmailDialog } from "./-components/test-email-dialog";
import { useTranslation } from "react-i18next";

const recentSegmentsQueryOptions = queryOptions({
  queryKey: ["admin", "segments", "recent"],
  queryFn: () => getRecentSegmentsForNotificationFn(),
});

const recipientsCountQueryOptions = queryOptions({
  queryKey: ["admin", "segments", "recipientsCount"],
  queryFn: () => getSegmentNotificationRecipientsCountFn(),
});

const emailBatchesQueryOptions = queryOptions({
  queryKey: ["admin", "emailBatches"],
  queryFn: () => getEmailBatchesFn(),
});

export const Route = createFileRoute("/admin/emails/segments")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(recentSegmentsQueryOptions);
    context.queryClient.ensureQueryData(recipientsCountQueryOptions);
    context.queryClient.ensureQueryData(emailBatchesQueryOptions);
  },
  component: SegmentNotificationsPage,
});

function SegmentNotificationsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedSegmentIds, setSelectedSegmentIds] = useState<number[]>([]);
  const [notificationType, setNotificationType] = useState<"new" | "updated">(
    "new"
  );
  const [testEmailOpen, setTestEmailOpen] = useState(false);

  const { data: segmentsData, isLoading: isLoadingSegments } = useQuery(
    recentSegmentsQueryOptions
  );

  const { data: recipientsData, isLoading: isLoadingRecipients } = useQuery(
    recipientsCountQueryOptions
  );

  const { data: emailBatches, isLoading: isLoadingBatches } = useQuery(
    emailBatchesQueryOptions
  );

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["admin", "emailBatches"] });
    }, 5000);

    return () => clearInterval(interval);
  }, [queryClient]);

  const sendNotificationMutation = useMutation({
    mutationFn: (data: {
      segmentIds: number[];
      notificationType: "new" | "updated";
    }) => sendSegmentNotificationBatchFn({ data }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "emailBatches"] });
      setSelectedSegmentIds([]);
      if (result.warning) {
        toast.warning(t("admin_pages.emailAdmin.toast.emailBatchCreated"), {
          description: result.warning,
        });
      } else {
        toast.success(t("admin_pages.emailAdmin.toast.emailBatchStarted"), {
          description: t("admin_pages.emailAdmin.toast.notificationsSending"),
        });
      }
    },
    onError: (error) => {
      toast.error(t("admin_pages.emailAdmin.toast.failedToSendNotifications"), {
        description:
          error instanceof Error ? error.message : t("admin_pages.emailAdmin.toast.anErrorOccurred"),
      });
    },
  });

  const sendTestEmailMutation = useMutation({
    mutationFn: (data: {
      email: string;
      segmentIds: number[];
      notificationType: "new" | "updated";
    }) => sendTestSegmentNotificationFn({ data }),
    onSuccess: () => {
      setTestEmailOpen(false);
      toast.success(t("admin_pages.emailAdmin.toast.testEmailSent"), {
        description: t("admin_pages.emailAdmin.toast.checkInbox"),
      });
    },
    onError: (error) => {
      toast.error(t("admin_pages.emailAdmin.toast.failedToSendTest"), {
        description:
          error instanceof Error ? error.message : t("admin_pages.emailAdmin.toast.anErrorOccurred"),
      });
    },
  });

  const handleSend = () => {
    sendNotificationMutation.mutate({
      segmentIds: selectedSegmentIds,
      notificationType,
    });
  };

  const handleTestEmail = (data: { email: string }) => {
    if (selectedSegmentIds.length === 0) {
      toast.error(t("admin_pages.emailAdmin.toast.noSegmentsSelected"), {
        description: t("admin_pages.emailAdmin.toast.selectAtLeastOneSegment"),
      });
      return;
    }

    sendTestEmailMutation.mutate({
      email: data.email,
      segmentIds: selectedSegmentIds,
      notificationType,
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div
          className="lg:col-span-3"
        >
          <SegmentSelector
            segments={segmentsData?.segments}
            isLoading={isLoadingSegments}
            selectedIds={selectedSegmentIds}
            onSelectionChange={setSelectedSegmentIds}
          />
        </div>

        <div
          className="lg:col-span-2"
        >
          <SegmentNotificationPanel
            selectedCount={selectedSegmentIds.length}
            recipientCount={recipientsData?.count}
            isLoadingRecipients={isLoadingRecipients}
            notificationType={notificationType}
            onNotificationTypeChange={setNotificationType}
            onSend={handleSend}
            isSending={sendNotificationMutation.isPending}
            recentBatches={emailBatches}
            isLoadingBatches={isLoadingBatches}
            onTestEmail={() => setTestEmailOpen(true)}
          />
        </div>
      </div>

      <TestEmailDialog
        open={testEmailOpen}
        onOpenChange={setTestEmailOpen}
        onSubmit={handleTestEmail}
        isPending={sendTestEmailMutation.isPending}
      />
    </>
  );
}
