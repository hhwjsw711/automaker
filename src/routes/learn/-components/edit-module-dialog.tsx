import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { adminMiddleware } from "~/lib/auth";
import { updateModuleUseCase } from "~/use-cases/modules";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { IconPicker, renderIcon } from "~/components/icon-picker";
import { useTranslation } from "react-i18next";

const editModuleSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  icon: z.string().nullable(),
});

type EditModuleFormData = z.infer<typeof editModuleSchema>;

export const updateModuleFn = createServerFn()
  .middleware([adminMiddleware])
  .inputValidator(
    z.object({
      moduleId: z.coerce.number(),
      title: z.string().min(1).max(255),
      icon: z.string().nullable(),
    })
  )
  .handler(async ({ data }) => {
    await updateModuleUseCase(data.moduleId, {
      title: data.title,
      icon: data.icon,
    });
  });

interface EditModuleDialogProps {
  moduleId: number;
  moduleTitle: string;
  moduleIcon: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditModuleDialog({
  moduleId,
  moduleTitle,
  moduleIcon,
  open,
  onOpenChange,
}: EditModuleDialogProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditModuleFormData>({
    resolver: zodResolver(editModuleSchema),
    defaultValues: {
      title: moduleTitle,
      icon: moduleIcon,
    },
  });

  // Reset form when dialog opens with new module data
  useEffect(() => {
    if (open) {
      form.reset({
        title: moduleTitle,
        icon: moduleIcon,
      });
    }
  }, [open, moduleTitle, moduleIcon, form]);

  const onSubmit = async (data: EditModuleFormData) => {
    try {
      setIsSubmitting(true);
      await updateModuleFn({
        data: { moduleId, title: data.title, icon: data.icon },
      });

      toast.success(t("learn.moduleUpdated"), {
        description: t("learn.moduleUpdatedDesc", { title: data.title }),
      });

      await queryClient.invalidateQueries({ queryKey: ["modules"] });
      onOpenChange(false);
    } catch (error) {
      toast.error(t("learn.failedUpdateModule"), {
        description: t("learn.tryAgain"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-theme-500/10">
              <Edit2 className="h-5 w-5 text-theme-600 dark:text-theme-400" />
            </div>
            <DialogTitle>{t("learn.editModule")}</DialogTitle>
          </div>
          <DialogDescription>
            {t("learn.editModuleDesc")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("learn.moduleTitle")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("learn.moduleTitlePlaceholder")}
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("learn.moduleIcon")}</FormLabel>
                  <FormControl>
                    <IconPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {t("learn.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("learn.saving") : t("learn.saveChanges")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
