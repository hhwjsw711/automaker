import { FileText, Clock } from "lucide-react";
import { type Segment } from "~/db/schema";
import { EditableContent } from "./editable-content";
import { useTranslation } from "react-i18next";

interface ContentPanelProps {
  currentSegment: Segment;
  isAdmin?: boolean;
}

export function ContentPanel({ currentSegment, isAdmin }: ContentPanelProps) {
  const { t } = useTranslation();

  if (currentSegment.isComingSoon && !isAdmin) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>{t("learn.contentComingSoon")}</p>
      </div>
    );
  }

  return (
    <EditableContent
      segmentId={currentSegment.id}
      field="content"
      content={currentSegment.content}
      isAdmin={isAdmin ?? false}
      emptyMessage={t("learn.noLessonContent")}
      emptyIcon={<FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />}
    />
  );
}
