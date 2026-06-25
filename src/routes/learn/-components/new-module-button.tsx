import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminMiddleware } from "~/lib/auth";
import { getOrCreateModuleUseCase } from "~/use-cases/modules";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const createModuleFn = createServerFn()
  .middleware([adminMiddleware])
  .inputValidator(
    z.object({
      title: z.string().min(1).max(100),
    })
  )
  .handler(async ({ data }) => {
    const module = await getOrCreateModuleUseCase(data.title);
    return module;
  });

export function NewModuleButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await createModuleFn({ data: { title: title.trim() } });
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      setTitle("");
      setOpen(false);
      // Refresh the page to show the new module
      router.invalidate();
    } catch (error) {
      console.error("Failed to create module:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer w-full flex items-center gap-3 px-6 py-3 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
      >
        <Plus className="w-4 h-4" />
        <span className="font-medium">{t("learn.newModule")}</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          animation="slide-in-bottom-left"
          className="sm:max-w-md glass border-slate-200/60 dark:border-white/10"
        >
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">
              {t("learn.createNewModule")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="module-title"
                className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
              >
                {t("learn.moduleTitle")}
              </label>
              <Input
                id="module-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("learn.moduleTitlePlaceholder")}
                disabled={isLoading}
                autoFocus
                className="glass border-slate-300/60 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="glass"
                className="rounded-xl px-5 py-2.5 text-xs font-bold"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                {t("learn.cancel")}
              </Button>
              <Button
                type="submit"
                variant="cyan"
                className="rounded-xl px-5 py-2.5 text-xs font-black shadow-lg shadow-cyan-500/20"
                disabled={!title.trim() || isLoading}
              >
                {isLoading ? t("learn.creating") : t("learn.createButton")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
