import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { assertAuthenticatedFn } from "~/fn/auth";
import { createAgentFn } from "~/fn/agents";
import { AgentForm, type AgentFormValues } from "./-components/agent-form";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../admin/-components/page-header";
import { Page } from "../admin/-components/page";
import { assertFeatureEnabled } from "~/lib/feature-flags";

export const Route = createFileRoute("/agents/new")({
  beforeLoad: async () => {
    await assertFeatureEnabled("AGENTS_FEATURE");
    await assertAuthenticatedFn();
  },
  component: CreateAgentPage,
});

function CreateAgentPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (values: AgentFormValues) => {
    setIsSubmitting(true);
    try {
      const agent = await createAgentFn({
        data: {
          name: values.name,
          description: values.description,
          type: values.type,
          content: values.content,
          isPublic: values.isPublic ?? true,
        },
      });

      // Navigate to the created agent
      navigate({
        to: "/agents/$slug",
        params: { slug: agent.slug },
      });
    } catch (error) {
      console.error("Failed to create agent:", error);
      // TODO: Add proper error handling/toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page>
      <PageHeader
        title={t("agents_public.uploadNew")}
        highlightedWord={t("agents_public.highlightedNew")}
        description={t("agents_public.uploadDescription")}
      />

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <AgentForm
          buttonText={t("agents_public.createAgent")}
          loadingText={t("agents_public.creatingAgent")}
          buttonIcon={Plus}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </Page>
  );
}
