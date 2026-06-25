import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useServerFn } from "@tanstack/react-start";
import { transcodeVideoFn } from "~/fn/video-transcoding";
import { Button } from "~/components/ui/button";
import { Loader2, Video } from "lucide-react";
import { toast } from "sonner";

interface TranscodeVideoButtonProps {
  segmentId: number;
  videoKey: string | null;
}

export function TranscodeVideoButton({
  segmentId,
  videoKey,
}: TranscodeVideoButtonProps) {
  const { t } = useTranslation();
  const [isTranscoding, setIsTranscoding] = useState(false);
  const transcodeVideo = useServerFn(transcodeVideoFn);

  if (!videoKey) {
    return null;
  }

  const handleTranscode = async () => {
    try {
      setIsTranscoding(true);
      const result = await transcodeVideo({ data: { segmentId } });
      toast.success(t("learn.transcodeSuccess"));
    } catch (error) {
      console.error("Transcoding error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to transcode video. Please try again.";
      toast.error(message);
    } finally {
      setIsTranscoding(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleTranscode}
      disabled={isTranscoding}
      className="w-full"
    >
      {isTranscoding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t("learn.transcoding")}
        </>
      ) : (
        <>
          <Video className="mr-2 h-4 w-4" />
          {t("learn.transcodeButton")}
        </>
      )}
    </Button>
  );
}
