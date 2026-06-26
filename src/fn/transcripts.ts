import { createServerFn } from "@tanstack/react-start";
import { adminMiddleware } from "~/lib/auth";
import { z } from "zod";
import { getStorage } from "~/utils/storage";
import {
  getSegmentByIdUseCase,
  editSegmentUseCase,
} from "~/use-cases/segments";
import { generateTranscriptFromVideo } from "~/utils/openai";

export const generateTranscriptFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(
    z.object({
      segmentId: z.number(),
    })
  )
  .handler(async ({ data }) => {
    const { segmentId } = data;

    // Get the segment to find the video key
    const segment = await getSegmentByIdUseCase(segmentId);
    if (!segment) {
      throw new Error("Segment not found");
    }

    if (!segment.videoKey) {
      throw new Error("This segment does not have a video attached");
    }

    // Download the video from storage
    const { storage } = getStorage();
    console.log(
      `Downloading video for segment ${segmentId}: ${segment.videoKey}`
    );
    const videoBuffer = await storage.getBuffer(segment.videoKey);
    console.log(`Downloaded video: ${videoBuffer.length} bytes`);

    // Generate the transcript
    const result = await generateTranscriptFromVideo(videoBuffer);

    // Update the segment with the formatted transcript text
    await editSegmentUseCase(segmentId, {
      transcripts: result.fullText,
    });

    return { success: true, transcript: result.fullText };
  });
