import { useState } from "react";
import {
  Check,
  Lock,
  GripVertical,
  PlayCircle,
  Sparkles,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
import type { Segment } from "~/db/schema";
import { cn } from "~/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { AVAILABLE_ICONS } from "~/components/icon-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { deleteSegmentFn } from "../$slug/-components/delete-segment-button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { modulesQueryOptions } from "../$slug/_layout";
import { useTranslation } from "react-i18next";

function isNewSegment(createdAt: Date | null): boolean {
  if (!createdAt) return false;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(createdAt) > sevenDaysAgo;
}

interface SegmentItemProps {
  segment: Segment;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  isLoggedIn?: boolean;
  onSegmentClick: (segmentId: number) => void;
  provided?: any;
  snapshot?: any;
}

export function SegmentItem({
  segment,
  index,
  isActive,
  isCompleted,
  isPremium,
  isAdmin,
  isLoggedIn,
  onSegmentClick,
  provided,
  snapshot,
}: SegmentItemProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Get the icon component for the segment
  const SegmentIcon = segment.icon && AVAILABLE_ICONS[segment.icon]
    ? AVAILABLE_ICONS[segment.icon]
    : PlayCircle;

  const handleDeleteSegment = async () => {
    try {
      await deleteSegmentFn({ data: { segmentId: segment.id } });
      queryClient.invalidateQueries(modulesQueryOptions);
      toast.success(t("learn.segmentDeleted"));
      setDeleteDialogOpen(false);
      // Navigate to learn page if we're on the deleted segment
      if (isActive) {
        navigate({ to: "/learn" });
      }
    } catch (error) {
      toast.error(t("learn.failedDeleteSegment"), {
        description: t("learn.tryAgain"),
      });
    }
  };

  const segmentContent = (
    <>
      <div
        className={cn(
          "flex items-center justify-center w-5 h-5 rounded transition-all duration-200 flex-shrink-0",
          isCompleted && isActive
            ? "bg-emerald-500 text-white glow-green"
            : isCompleted
              ? "bg-emerald-500/40 dark:bg-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : isActive
                ? "bg-cyan-600/20 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400"
                : "bg-slate-200/60 dark:bg-white/5 text-slate-500 group-hover/segment:text-cyan-600 dark:group-hover/segment:text-cyan-400"
        )}
      >
        {isCompleted ? (
          <Check className="h-3 w-3" />
        ) : (
          <SegmentIcon className="h-3 w-3" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <span
          className={cn(
            "text-sm transition-colors duration-200 truncate block",
            isActive
              ? "text-slate-900 dark:text-white font-medium"
              : "text-slate-600 dark:text-slate-400 group-hover/segment:text-slate-900 dark:group-hover/segment:text-white"
          )}
        >
          {segment.title}
        </span>
        {segment.length && (
          <span className="text-[10px] text-slate-500 font-mono">
            {segment.length}
          </span>
        )}
      </div>

      <div className="flex-shrink-0 flex items-center gap-1.5">
        {isNewSegment(segment.createdAt) &&
          !isCompleted &&
          !segment.isComingSoon && (
            <span
              data-testid="new-segment-badge"
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
            >
              <Sparkles className="h-2.5 w-2.5" />
              {t("learn.new")}
            </span>
          )}
        {segment.isComingSoon && (
          <span
            data-testid="coming-soon-badge"
            className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/20"
          >
            {t("learn.soon")}
          </span>
        )}
        {segment.isPremium && !isPremium && !isAdmin && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <Lock className="h-2.5 w-2.5" />
            {t("learn.pro")}
          </span>
        )}
      </div>
    </>
  );

  const content = (
    <div
      className={cn(
        "segment-item group/segment transition-all duration-200 ease-out",
        isActive && "segment-active",
        !isActive && "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
      )}
    >
      <div className="flex items-center gap-2 px-6 py-2.5">
        {provided && (
          <div
            {...provided.dragHandleProps}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab active:cursor-grabbing opacity-0 group-hover/segment:opacity-100 transition-opacity"
          >
            <GripVertical className="h-3 w-3 text-slate-400 dark:text-slate-500" />
          </div>
        )}

        <Link
          to="/learn/$slug"
          params={{ slug: segment.slug }}
          onClick={(e) => {
            // Prevent navigation only if actively dragging
            if (snapshot?.isDragging) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            // Update context for immediate UI feedback
            // The Link will handle the actual navigation
            onSegmentClick(segment.id);
          }}
          aria-label={t("learn.selectSegment", { title: segment.title })}
          className="cursor-pointer flex items-center gap-3 flex-1 text-left min-w-0"
        >
          {segmentContent}
        </Link>

        {isAdmin && (
          <div className="ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 opacity-0 group-hover/segment:opacity-100 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">{t("learn.openMenu")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    to="/learn/$slug/edit"
                    params={{ slug: segment.slug }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    {t("learn.edit")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteDialogOpen(true);
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("learn.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );

  const componentContent = (
    <>
      {provided ? (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "relative",
            snapshot?.isDragging && "z-50 rotate-1 scale-[1.02]"
          )}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          {content}
        </div>
      ) : (
        content
      )}

      {isAdmin && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
                  {t("learn.deleteSegmentConfirm")}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
                {t("learn.deleteSegmentDesc")}
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
      )}
    </>
  );

  return componentContent;
}
