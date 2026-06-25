import { useState, type ReactNode } from "react";
import { Edit, Save, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { MarkdownContent } from "~/routes/learn/-components/markdown-content";
import { useUpdateSegmentContent } from "~/hooks/mutations/use-update-segment-content";
import { useTranslation } from "react-i18next";

interface EditableContentProps {
  segmentId: number;
  field: "summary" | "content" | "transcripts";
  content: string | null;
  isAdmin: boolean;
  emptyMessage: string;
  emptyIcon: ReactNode;
}

export function EditableContent({
  segmentId,
  field,
  content,
  isAdmin,
  emptyMessage,
  emptyIcon,
}: EditableContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content || "");
  const { t } = useTranslation();
  const { mutate: updateContent, isPending } = useUpdateSegmentContent();

  const handleEdit = () => {
    setEditValue(content || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    updateContent(
      { segmentId, field, value: editValue },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setEditValue(content || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="animate-fade-in space-y-4">
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="min-h-[300px] font-mono text-sm"
          placeholder={t("learn.enterFieldContent", { field })}
          autoFocus
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white/70 mr-2" />
                {t("learn.saving")}
              </>
            ) : (
              <>
                <Save className="mr-2 h-3 w-3" />
                {t("learn.saveChanges")}
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
          >
            <X className="mr-2 h-3 w-3" />
            {t("learn.cancel")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="text-muted-foreground hover:text-foreground"
          >
            <Edit className="mr-2 h-4 w-4" />
            {t("learn.edit")}
          </Button>
        </div>
      )}

      {content ? (
        <MarkdownContent content={content} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {emptyIcon}
          <p>{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
