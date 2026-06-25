import { Button, buttonVariants } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "../_layout.index";
import { useQueryClient } from "@tanstack/react-query";
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
import { adminMiddleware } from "~/lib/auth";
import { deleteSegmentUseCase } from "~/use-cases/segments";
import { toast } from "sonner";
import { modulesQueryOptions } from "../_layout";

// TODO: there is a bug when trying to delet a segment
export const deleteSegmentFn = createServerFn()
  .middleware([adminMiddleware])
  .inputValidator(z.object({ segmentId: z.coerce.number() }))
  .handler(async ({ data }) => {
    await deleteSegmentUseCase(data.segmentId);
  });

interface DeleteVideoButtonProps {
  currentSegmentId: number;
}

export function DeleteSegmentButton({
  currentSegmentId,
}: DeleteVideoButtonProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { segments } = Route.useLoaderData();

  // Find the fallback segment (previous or next available segment)
  const fallbackSegment = useMemo(() => {
    // Find the current module and segment index
    const currentModule = segments.find(
      (segment) => segment.id === currentSegmentId
    )?.moduleId;
    if (!currentModule) return null;

    // Get all segments in the current module and sort by order
    const currentModuleSegments = segments
      .filter((s) => s.moduleId === currentModule)
      .sort((a, b) => a.order - b.order);
    const currentIndex = currentModuleSegments.findIndex(
      (s) => s.id === currentSegmentId
    );

    // If there's a previous segment in the current module
    if (currentIndex > 0) {
      return currentModuleSegments[currentIndex - 1];
    }

    // If there's a next segment in the current module
    if (currentIndex < currentModuleSegments.length - 1) {
      return currentModuleSegments[currentIndex + 1];
    }

    // If we're at the start of the current module, find the previous module
    const modules = segments.reduce(
      (acc, segment) => {
        if (!acc[segment.moduleId]) {
          acc[segment.moduleId] = [];
        }
        acc[segment.moduleId].push(segment);
        return acc;
      },
      {} as Record<number, typeof segments>
    );

    // Sort segments within each module by order
    Object.keys(modules).forEach((moduleId) => {
      modules[Number(moduleId)].sort((a, b) => a.order - b.order);
    });

    const moduleIds = Object.keys(modules)
      .map(Number)
      .sort((a, b) => a - b);
    const currentModuleIndex = moduleIds.indexOf(currentModule);

    // If there's a previous module
    if (currentModuleIndex > 0) {
      const prevModuleId = moduleIds[currentModuleIndex - 1];
      const prevModuleSegments = modules[prevModuleId];
      return prevModuleSegments[prevModuleSegments.length - 1]; // Return last segment of previous module
    }

    // If there's a next module
    if (currentModuleIndex < moduleIds.length - 1) {
      const nextModuleId = moduleIds[currentModuleIndex + 1];
      const nextModuleSegments = modules[nextModuleId];
      return nextModuleSegments[0]; // Return first segment of next module
    }

    // If this is the only segment, try to find any other segment
    const otherSegments = segments.filter((s) => s.id !== currentSegmentId);
    return otherSegments.length > 0 ? otherSegments[0] : null;
  }, [currentSegmentId, segments]);

  const handleDeleteSegment = async () => {
    try {
      // Delete the segment first
      await deleteSegmentFn({ data: { segmentId: currentSegmentId } });

      // Invalidate relevant queries to refresh the UI
      queryClient.invalidateQueries(modulesQueryOptions);

      // Navigate after successful deletion to prevent race conditions
      if (fallbackSegment) {
        navigate({
          to: "/learn/$slug",
          params: { slug: fallbackSegment.slug },
          replace: true, // Replace history entry to prevent back navigation to deleted segment
        });

        toast.success(t("learn.contentDeleted"), {
          description: `Redirected to: ${fallbackSegment.title}`,
        });
      } else {
        // If no fallback segment exists, navigate to the main learning page
        navigate({ to: "/learn", replace: true });

        toast.success(t("learn.contentDeleted"), {
          description: t("learn.contentDeletedRedirect"),
        });
      }

      // close the dialog manually
      setOpen(false);
    } catch (error) {
      toast.error(t("learn.contentDeleteFail"), {
        description: t("learn.tryAgain"),
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-red-50/50 dark:bg-white/[0.03] border border-red-500/30 px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 backdrop-blur-[24px] transition-all hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300 whitespace-nowrap">
          <Trash2 className="w-3.5 h-3.5" />
          {t("learn.delete")}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent
        animation="slide-in-top-right"
        className="bg-background border border-border shadow-elevation-3 rounded-xl max-w-md mx-auto"
      >
        <AlertDialogHeader className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-foreground leading-tight">
              {t("learn.contentDeleteConfirmTitle")}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
            {t("learn.contentDeleteConfirmDesc")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3 p-6 pt-0">
          <AlertDialogCancel
            className={buttonVariants({ variant: "gray-outline" })}
          >
            {t("learn.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteSegment}
            className={buttonVariants({ variant: "destructive" })}
          >
            {t("learn.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
