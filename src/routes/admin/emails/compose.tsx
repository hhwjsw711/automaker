import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryOptions } from "@tanstack/react-query";
import {
  createEmailBatchFn,
  sendTestEmailFn,
  getUsersForEmailingFn,
} from "~/fn/emails";
import { EmailComposer } from "./-components/email-composer";
import { TestEmailDialog } from "./-components/test-email-dialog";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const usersForEmailingQueryOptions = queryOptions({
  queryKey: ["admin", "usersForEmailing"],
  queryFn: () => getUsersForEmailingFn(),
});

export const Route = createFileRoute("/admin/emails/compose")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(usersForEmailingQueryOptions);
  },
  component: ComposeEmailPage,
});

function ComposeEmailPage() {
  const { t } = useTranslation();
  const [testEmailOpen, setTestEmailOpen] = useState(false);
  const [showMarkdownGuide, setShowMarkdownGuide] = useState(false);
  const queryClient = useQueryClient();

  const { data: usersForEmailing, isLoading: usersLoading } = useQuery(
    usersForEmailingQueryOptions
  );

  const emailFormSchema = z.object({
    subject: z
      .string()
      .min(1, t("admin_pages.emailAdmin.validation.subjectRequired"))
      .max(200, t("admin_pages.emailAdmin.validation.subjectTooLong")),
    content: z.string().min(1, t("admin_pages.emailAdmin.validation.contentRequired")),
    recipientType: z.enum([
      "all",
      "premium",
      "free",
      "newsletter",
      "waitlist",
      "everyone",
    ]),
  });

  type EmailFormData = z.infer<typeof emailFormSchema>;

  const testEmailSchema = z.object({
    email: z.string().email(t("admin_pages.emailAdmin.validation.validEmail")),
  });

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      subject: "",
      content: "",
      recipientType: "all",
    },
  });

  const createEmailBatch = useMutation({
    mutationFn: (data: EmailFormData) => createEmailBatchFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "emailBatches"] });
      form.reset();
      toast.success(t("admin_pages.emailAdmin.toast.emailBatchCreated"), {
        description: t("admin_pages.emailAdmin.toast.emailSending"),
      });
    },
    onError: (error) => {
      toast.error(t("admin_pages.emailAdmin.toast.failedToCreateBatch"), {
        description: error.message,
      });
    },
  });

  const sendTestEmail = useMutation({
    mutationFn: (data: { email: string; subject: string; content: string }) =>
      sendTestEmailFn({ data }),
    onSuccess: () => {
      setTestEmailOpen(false);
      toast.success(t("admin_pages.emailAdmin.toast.testEmailSent"), {
        description: t("admin_pages.emailAdmin.toast.checkInbox"),
      });
    },
    onError: (error) => {
      toast.error(t("admin_pages.emailAdmin.toast.failedToSendTest"), {
        description: error.message,
      });
    },
  });

  const getRecipientCount = (type: string) => {
    if (!usersForEmailing || usersLoading) return 0;

    switch (type) {
      case "all":
        return usersForEmailing.totalUsers;
      case "premium":
        return usersForEmailing.premiumUsers;
      case "free":
        return usersForEmailing.freeUsers;
      case "newsletter":
        return usersForEmailing.newsletterUsers || 0;
      case "waitlist":
        return usersForEmailing.waitlistUsers || 0;
      case "everyone":
        return usersForEmailing.everyoneCount || 0;
      default:
        return 0;
    }
  };

  const onSubmit = (data: EmailFormData) => {
    createEmailBatch.mutate(data);
  };

  const onTestEmail = (data: { email: string }) => {
    const subject = form.getValues("subject");
    const content = form.getValues("content");

    if (!subject || !content) {
      toast.error(t("admin_pages.emailAdmin.toast.missingContent"), {
        description: t("admin_pages.emailAdmin.toast.missingContentDescription"),
      });
      return;
    }

    sendTestEmail.mutate({
      email: data.email,
      subject,
      content,
    });
  };

  return (
    <>
      <div
      >
        <EmailComposer
          form={form}
          onSubmit={onSubmit}
          onTestEmail={() => setTestEmailOpen(true)}
          getRecipientCount={getRecipientCount}
          createEmailBatchPending={createEmailBatch.isPending}
          showMarkdownGuide={showMarkdownGuide}
          setShowMarkdownGuide={setShowMarkdownGuide}
        />
      </div>

      <TestEmailDialog
        open={testEmailOpen}
        onOpenChange={setTestEmailOpen}
        onSubmit={onTestEmail}
        isPending={sendTestEmail.isPending}
      />
    </>
  );
}
