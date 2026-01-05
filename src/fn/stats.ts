import { createServerFn } from "@tanstack/react-start";
import { getCourseStatsUseCase } from "~/use-cases/stats";
import { unauthenticatedMiddleware } from "~/lib/auth";

export const getCourseStatsFn = createServerFn()
  .middleware([unauthenticatedMiddleware])
  .handler(async () => {
    return getCourseStatsUseCase();
  });
