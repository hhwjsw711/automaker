import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Send } from "lucide-react";

const testEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type TestEmailData = z.infer<typeof testEmailSchema>;

interface TestEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TestEmailData) => void;
  isPending: boolean;
}

export function TestEmailDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: TestEmailDialogProps) {
  const { t } = useTranslation();

  const form = useForm<TestEmailData>({
    resolver: zodResolver(testEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (data: TestEmailData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("admin_pages.emailAdmin.sendTestEmail")}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t("admin_pages.emailAdmin.sendTestEmailDescription")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin_pages.emailAdmin.testEmailAddress")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("admin_pages.emailAdmin.testEmailPlaceholder")}
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                {t("admin_pages.emailAdmin.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="btn-gradient flex-1"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/70"></div>
                    <span>{t("admin_pages.emailAdmin.sending")}</span>
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t("admin_pages.emailAdmin.sendTest")}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
