import { createServerFn } from "@tanstack/react-start";
import {
  authenticatedMiddleware,
  unauthenticatedMiddleware,
  adminMiddleware,
} from "~/lib/auth";
import { z } from "zod";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
  getAllRecentComments,
  deleteCommentAsAdmin,
} from "~/data-access/comments";
import { env } from "~/utils/env";

const MAX_COMMENTS_PER_PAGE = 100;

export const getCommentsFn = createServerFn()
  .middleware([unauthenticatedMiddleware])
  .inputValidator(z.object({ segmentId: z.number() }))
  .handler(async ({ data }) => {
    return getComments(data.segmentId);
  });

const createCommentSchema = z.object({
  segmentId: z.number(),
  content: z.string(),
  parentId: z.number().nullable(),
  repliedToId: z.number().nullable(),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;

export const createCommentFn = createServerFn({ method: "POST" })
  .middleware([authenticatedMiddleware])
  .inputValidator(createCommentSchema)
  .handler(async ({ data, context }) => {
    return createComment({
      userId: context.userId,
      segmentId: data.segmentId,
      content: data.content,
      parentId: data.parentId,
      repliedToId: data.repliedToId,
    });
  });

export const deleteCommentFn = createServerFn({ method: "POST" })
  .middleware([authenticatedMiddleware])
  .inputValidator(z.object({ commentId: z.number() }))
  .handler(async ({ data, context }) => {
    return deleteComment(data.commentId, context.userId);
  });

const updateCommentSchema = z.object({
  commentId: z.number(),
  content: z.string(),
});

export type UpdateCommentSchema = z.infer<typeof updateCommentSchema>;

export const updateCommentFn = createServerFn({ method: "POST" })
  .middleware([authenticatedMiddleware])
  .inputValidator(updateCommentSchema)
  .handler(async ({ data, context }) => {
    return updateComment(data.commentId, data.content, context.userId);
  });

export const getAllRecentCommentsFn = createServerFn()
  .middleware([adminMiddleware])
  .inputValidator(z.object({ filterAdminReplied: z.boolean().optional() }))
  .handler(async ({ data }) => {
    return getAllRecentComments(
      MAX_COMMENTS_PER_PAGE,
      data?.filterAdminReplied ?? false
    );
  });

export const deleteCommentAsAdminFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(z.object({ commentId: z.number() }))
  .handler(async ({ data }) => {
    return deleteCommentAsAdmin(data.commentId);
  });

export const translateCommentFn = createServerFn({ method: "POST" })
  .middleware([authenticatedMiddleware])
  .inputValidator(z.object({ content: z.string().min(1), targetLanguage: z.string() }))
  .handler(async ({ data }) => {
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OpenAI API key not configured");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a translator. Translate the following text into ${data.targetLanguage}. Return ONLY the translated text, no explanations or notes.`,
          },
          { role: "user", content: data.content },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`Translation failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const choice = result.choices?.[0];
    if (!choice?.message?.content) {
      throw new Error("Translation returned empty response");
    }
    return { translated: choice.message.content.trim() };
  });
