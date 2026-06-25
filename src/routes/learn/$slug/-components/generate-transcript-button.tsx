import { Button } from "~/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type Segment } from "~/db/schema";
import { toast } from "sonner";
import { generateTranscriptFn } from "~/fn/transcripts";
import { useRouter } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { buttonVariants } from "~/components/ui/button";

interface GenerateTranscriptButtonProps {
  currentSegment: Segment;
}

export function GenerateTranscriptButton({
  currentSegment,
}: GenerateTranscriptButtonProps) {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const hasExistingTranscript = !!currentSegment.transcripts;
  const hasVideo = !!currentSegment.videoKey;

  const handleGenerateTranscript = async () => {
    if (!hasVideo) {
      toast.error(t("learn.noVideoAttached"), {
        description: t("learn.noVideoDesc"),
      });
      return;
    }

    try {
      setIsGenerating(true);
      setOpen(false);

      toast.info(t("learn.generatingTranscript"), {
        description: t("learn.generatingTranscriptDesc"),
        duration: 10000,
      });

      await generateTranscriptFn({ data: { segmentId: currentSegment.id } });

      toast.success(t("learn.transcriptGenerated"), {
        description: t("learn.transcriptGeneratedDesc"),
      });

      // Refresh the page to show the new transcript
      router.invalidate();
    } catch (error) {
      console.error("Failed to generate transcript:", error);
      toast.error(t("learn.transcriptFailed"), {
        description:
          error instanceof Error
            ? error.message
            : t("learn.transcriptFailedDesc"),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!hasVideo) {
    return null;
  }

  // If there's an existing transcript, show a confirmation dialog
  if (hasExistingTranscript) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("learn.generating")}
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                {t("learn.regenerateTranscript")}
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          animation="slide-in-top-right"
          className="bg-background border border-border shadow-elevation-3 rounded-xl max-w-md mx-auto"
        >
          <AlertDialogHeader className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <FileText className="h-5 w-5 text-amber-500" />
              </div>
              <AlertDialogTitle className="text-xl font-semibold text-foreground leading-tight">
                {t("learn.regenerateTranscriptTitle")}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
              {t("learn.regenerateTranscriptDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3 p-6 pt-0">
            <AlertDialogCancel
              className={buttonVariants({ variant: "gray-outline" })}
            >
              {t("learn.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleGenerateTranscript}
              className={buttonVariants({ variant: "default" })}
            >
              {t("learn.regenerate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // No existing transcript, just show the button
  return (
    <Button variant="outline" onClick={handleGenerateTranscript} disabled={isGenerating}>
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("learn.generating")}
        </>
      ) : (
        <>
          <FileText className="h-4 w-4" />
          {t("learn.generateTranscript")}
        </>
      )}
    </Button>
  );
}
