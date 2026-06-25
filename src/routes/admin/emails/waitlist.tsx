import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryOptions } from "@tanstack/react-query";
import {
  getWaitlistEmailTemplateFn,
  updateWaitlistEmailTemplateFn,
} from "~/fn/email-templates";
import { WaitlistEmailEditor } from "./-components/waitlist-email-editor";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const waitlistEmailTemplateQueryOptions = queryOptions({
  queryKey: ["admin", "waitlistEmailTemplate"],
  queryFn: () => getWaitlistEmailTemplateFn(),
});

export const Route = createFileRoute("/admin/emails/waitlist")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(waitlistEmailTemplateQueryOptions);
  },
  component: WaitlistEmailPage,
});

function WaitlistEmailPage() {
  const { t } = useTranslation();
  const [showMarkdownGuide, setShowMarkdownGuide] = useState(false);
  const queryClient = useQueryClient();

  const { data: waitlistTemplate, isLoading: waitlistTemplateLoading } =
    useQuery(waitlistEmailTemplateQueryOptions);

  const waitlistEmailSchema = z.object({
    subject: z
      .string()
      .min(1, t("admin_pages.emailAdmin.validation.subjectRequired"))
      .max(200, t("admin_pages.emailAdmin.validation.subjectTooLong")),
    content: z.string().min(1, t("admin_pages.emailAdmin.validation.contentRequired")),
  });

  type WaitlistEmailData = z.infer<typeof waitlistEmailSchema>;

  const waitlistForm = useForm<WaitlistEmailData>({
    resolver: zodResolver(waitlistEmailSchema),
    defaultValues: {
      subject: waitlistTemplate?.subject || "",
      content: waitlistTemplate?.content || "",
    },
  });

  useEffect(() => {
    if (waitlistTemplate) {
      waitlistForm.reset({
        subject: waitlistTemplate.subject,
        content: waitlistTemplate.content,
      });
    }
  }, [waitlistTemplate, waitlistForm]);

  const updateWaitlistTemplate = useMutation({
    mutationFn: (data: WaitlistEmailData) =>
      updateWaitlistEmailTemplateFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "waitlistEmailTemplate"],
      });
      toast.success(t("admin_pages.emailAdmin.toast.templateSaved"), {
        description: t("admin_pages.emailAdmin.toast.waitlistTemplateUpdated"),
      });
    },
    onError: (error) => {
      toast.error(t("admin_pages.emailAdmin.toast.failedToSaveTemplate"), {
        description: error.message,
      });
    },
  });

  const onWaitlistTemplateSubmit = (data: WaitlistEmailData) => {
    updateWaitlistTemplate.mutate(data);
  };

  return (
    <div
    >
      <WaitlistEmailEditor
        form={waitlistForm}
        onSubmit={onWaitlistTemplateSubmit}
        isSaving={updateWaitlistTemplate.isPending}
        showMarkdownGuide={showMarkdownGuide}
        setShowMarkdownGuide={setShowMarkdownGuide}
      />
    </div>
  );
}
