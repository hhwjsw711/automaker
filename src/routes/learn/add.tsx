import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { assertAuthenticatedFn } from "~/fn/auth";
import {
  getUniqueModuleNamesFn,
  AddSegmentHeader,
  useAddSegment,
} from "./-components/add-segment";
import { Container } from "./-components/container";
import { SegmentForm } from "./-components/segment-form";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const addSegmentSearchSchema = z.object({
  moduleTitle: z.string().optional(),
});

export const Route = createFileRoute("/learn/add")({
  component: RouteComponent,
  beforeLoad: () => assertAuthenticatedFn(),
  validateSearch: addSegmentSearchSchema,
  loader: async () => {
    const moduleNames = await getUniqueModuleNamesFn();
    return { moduleNames };
  },
});

function RouteComponent() {
  const { moduleNames } = Route.useLoaderData();
  const search = Route.useSearch();
  const { t } = useTranslation();
  const { onSubmit, isSubmitting, uploadProgress } = useAddSegment();

  return (
    <div className="container mx-auto">
      <AddSegmentHeader />
      <Container>
        <SegmentForm
          headerTitle={t("learn.createNewSegment")}
          headerDescription={t("learn.createNewSegmentDesc")}
          buttonText={t("learn.createSegment")}
          loadingText={t("learn.creating")}
          buttonIcon={Plus}
          moduleNames={moduleNames}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
          defaultValues={{
            title: "",
            content: "",
            transcripts: "",
            slug: "",
            moduleTitle: search.moduleTitle || "",
            isPremium: false,
            isComingSoon: false,
            notifyUsers: false,
          }}
        />
      </Container>
    </div>
  );
}
