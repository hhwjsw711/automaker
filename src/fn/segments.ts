import { createServerFn } from "@tanstack/react-start";
import { getSegments } from "~/data-access/segments";
import { adminMiddleware, unauthenticatedMiddleware } from "~/lib/auth";
import { z } from "zod";
import {
  reorderSegmentsUseCase,
  editSegmentUseCase,
  getSegmentsUseCase,
  getFirstVideoSegmentUseCase,
} from "~/use-cases/segments";

export const getSegmentsFn = createServerFn()
  .middleware([unauthenticatedMiddleware])
  .handler(async () => {
    return getSegmentsUseCase();
  });

export const getFirstSegmentFn = createServerFn()
  .middleware([unauthenticatedMiddleware])
  .handler(async () => {
    const segments = await getSegments();
    return segments[0] ?? null;
  });

export const getFirstVideoSegmentFn = createServerFn()
  .middleware([unauthenticatedMiddleware])
  .handler(async () => {
    return getFirstVideoSegmentUseCase();
  });

export const reorderSegmentsFn = createServerFn()
  .middleware([adminMiddleware])
  .inputValidator(z.array(z.object({ id: z.number(), order: z.number() })))
  .handler(async ({ data }) => {
    return reorderSegmentsUseCase(data);
  });

export const updateSegmentContentFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(
    z.object({
      segmentId: z.number(),
      field: z.enum(["summary", "content", "transcripts"]),
      value: z.string(),
    })
  )
  .handler(async ({ data }) => {
    return editSegmentUseCase(data.segmentId, { [data.field]: data.value });
  });
