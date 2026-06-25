import { Button, buttonVariants } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
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
import { deleteModuleUseCase } from "~/use-cases/modules";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const deleteModuleFn = createServerFn()
  .middleware([adminMiddleware])
  .inputValidator(z.object({ moduleId: z.coerce.number() }))
  .handler(async ({ data }) => {
    await deleteModuleUseCase(data.moduleId);
  });

interface DeleteModuleButtonProps {
  moduleId: number;
  moduleTitle: string;
}

export function DeleteModuleButton({
  moduleId,
  moduleTitle,
}: DeleteModuleButtonProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleDeleteModule = async () => {
    try {
      await deleteModuleFn({ data: { moduleId } });

      toast.success(t("learn.moduleDeleted"), {
        description: t("learn.moduleDeletedDesc", { title: moduleTitle }),
      });

      // Refresh the page to update the module list
      router.invalidate();
    } catch (error) {
      toast.error(t("learn.failedDeleteModule"), {
        description: t("learn.tryAgain"),
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        animation="slide-left"
        className="bg-background border border-border shadow-elevation-3 rounded-xl max-w-md mx-auto"
      >
        <AlertDialogHeader className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-foreground leading-tight">
              {t("learn.deleteModule")}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
            {t("learn.deleteModuleConfirm", { title: moduleTitle })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3 p-6 pt-0">
          <AlertDialogCancel
            className={buttonVariants({ variant: "gray-outline" })}
          >
            {t("learn.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteModule}
            className={buttonVariants({ variant: "destructive" })}
          >
            {t("learn.deleteModule")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
