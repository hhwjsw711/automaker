import {
  createSegment,
  deleteSegment,
  getSegmentById,
  getSegments,
  updateSegment,
  getSegmentAttachments,
  deleteAttachment,
  getSegmentBySlug,
} from "~/data-access/segments";
import type { Segment, SegmentCreate } from "~/db/schema";
import { eq } from "drizzle-orm";
import { getOrCreateModuleUseCase } from "./modules";
import { database } from "~/db";
import { segments } from "~/db/schema";
import { getStorage } from "~/utils/storage";

export async function getSegmentsUseCase() {
  return getSegments();
}

export async function getSegmentBySlugUseCase(slug: Segment["slug"]) {
  return getSegmentBySlug(slug);
}

export async function getSegmentByIdUseCase(id: Segment["id"]) {
  return getSegmentById(id);
}

export async function addSegmentUseCase(
  segment: SegmentCreate & { moduleTitle: string }
) {
  // Get or create the module
  const module = await getOrCreateModuleUseCase(segment.moduleTitle);

  // Create the segment with the module's ID
  return createSegment({ ...segment, moduleId: module.id });
}

export async function editSegmentUseCase(
  id: number,
  segment: Partial<SegmentCreate>
) {
  return updateSegment(id, segment);
}

export async function removeSegmentUseCase(id: number) {
  return deleteSegment(id);
}

export type SegmentUpdate = Partial<
  Omit<Segment, "id" | "createdAt" | "updatedAt">
>;

export async function updateSegmentUseCase(
  segmentId: number,
  data: SegmentUpdate & { moduleTitle: string }
) {
  const { storage } = getStorage();
  const segment = await getSegmentById(segmentId);
  if (!segment) throw new Error("Segment not found");

  // Handle video deletion if updating video
  if (segment.videoKey && data.videoKey) {
    await storage.delete(segment.videoKey);
  }

  // Get or create the module
  const module = await getOrCreateModuleUseCase(data.moduleTitle);

  // Update the segment with the module's ID
  return await updateSegment(segmentId, { ...data, moduleId: module.id });
}

export async function deleteSegmentUseCase(segmentId: number) {
  const { storage } = getStorage();
  const segment = await getSegmentById(segmentId);
  if (!segment) throw new Error("Segment not found");

  // Delete video file if it exists
  if (segment.videoKey) {
    await storage.delete(segment.videoKey);
  }

  // Get and delete all attachment files
  const attachments = await getSegmentAttachments(segmentId);
  await Promise.all(
    attachments.map(async (attachment) => {
      await storage.delete(attachment.fileKey);
      // await deleteAttachment(attachment.id);
    })
  );

  // Finally delete the segment (this will cascade delete attachments due to foreign key)
  return deleteSegment(segmentId);
}

export async function reorderSegmentsUseCase(
  updates: { id: number; order: number }[]
) {
  return database.transaction(async (tx) => {
    const results = [];
    for (const update of updates) {
      const [result] = await tx
        .update(segments)
        .set({ order: update.order, updatedAt: new Date() })
        .where(eq(segments.id, update.id))
        .returning();
      results.push(result);
    }
    return results;
  });
}

export async function getFirstVideoSegmentUseCase() {
  const { modules } = await import("~/db/schema");
  const { getThumbnailKey } = await import("~/utils/video-transcoding");

  // Get segments ordered by module order, then segment order
  const result = await database
    .select({
      segment: segments,
      moduleOrder: modules.order,
    })
    .from(segments)
    .innerJoin(modules, eq(segments.moduleId, modules.id))
    .orderBy(modules.order, segments.order);

  // Find the first segment that has a video and is not premium
  // (Landing page should show free preview content)
  const firstVideoSegment = result
    .map((row) => row.segment)
    .find(
      (segment) =>
        segment.videoKey && !segment.isPremium && !segment.isComingSoon
    );

  // Get thumbnail URL server-side if available
  let thumbnailUrl: string | null = null;
  if (firstVideoSegment?.videoKey) {
    const { storage, type } = getStorage();
    if (type === "r2") {
      const thumbnailKey =
        firstVideoSegment.thumbnailKey ||
        getThumbnailKey(firstVideoSegment.videoKey);
      const exists = await storage.exists(thumbnailKey);
      if (exists) {
        thumbnailUrl = await storage.getPresignedUrl(thumbnailKey);
      }
    }
  }

  return { segment: firstVideoSegment ?? null, thumbnailUrl };
}
