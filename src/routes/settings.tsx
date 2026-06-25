import { createFileRoute } from "@tanstack/react-router";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Settings, Mail, Bell, Save, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { authenticatedMiddleware } from "~/lib/auth";
import { queryOptions } from "@tanstack/react-query";
import {
  getUserEmailPreferencesFn,
  updateEmailPreferencesFn,
} from "~/fn/user-settings";
import { assertAuthenticatedFn } from "~/fn/auth";
import { useTranslation } from "react-i18next";

// Form validation schema
const emailPreferencesSchema = z.object({
  allowCourseUpdates: z.boolean(),
  allowPromotional: z.boolean(),
});

type EmailPreferencesData = z.infer<typeof emailPreferencesSchema>;

// Query options
const emailPreferencesQueryOptions = queryOptions({
  queryKey: ["user", "emailPreferences"],
  queryFn: () => getUserEmailPreferencesFn(),
});

export const Route = createFileRoute("/settings")({
  beforeLoad: () => assertAuthenticatedFn(),
  loader: ({ context }) => {
    return {
      emailPreferences: context.queryClient.ensureQueryData(
        emailPreferencesQueryOptions
      ),
    };
  },
  component: SettingsPage,
});

function SettingsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: emailPreferences } = useSuspenseQuery(
    emailPreferencesQueryOptions
  );

  // Form setup
  const form = useForm<EmailPreferencesData>({
    resolver: zodResolver(emailPreferencesSchema),
    defaultValues: {
      allowCourseUpdates: emailPreferences?.allowCourseUpdates ?? true,
      allowPromotional: emailPreferences?.allowPromotional ?? true,
    },
  });

  // Update email preferences mutation
  const updatePreferences = useMutation({
    mutationFn: (data: EmailPreferencesData) =>
      updateEmailPreferencesFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "emailPreferences"] });
      toast.success(t("settings.savedTitle"), {
        description: t("settings.savedDesc"),
      });
    },
    onError: (error) => {
      toast.error(t("settings.saveFailed"), {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: EmailPreferencesData) => {
    updatePreferences.mutate(data);
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="h-8 w-8 text-theme-600" />
        <div>
          <h1 className="text-3xl font-bold">{t("settings.heading")}</h1>
          <p className="text-muted-foreground">
            {t("settings.description")}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Email Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {t("settings.emailPreferences")}
            </CardTitle>
            <CardDescription>
              {t("settings.emailPreferencesDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="allowCourseUpdates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium">
                          {t("settings.courseUpdates")}
                        </FormLabel>
                        <FormDescription>
                          {t("settings.courseUpdatesDesc")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowPromotional"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium">
                          {t("settings.promotionalEmails")}
                        </FormLabel>
                        <FormDescription>
                          {t("settings.promotionalEmailsDesc")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={updatePreferences.isPending}
                    className="flex items-center gap-2"
                  >
                    {updatePreferences.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : updatePreferences.isSuccess ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {updatePreferences.isPending
                      ? t("settings.saving")
                      : updatePreferences.isSuccess
                        ? t("settings.saved")
                        : t("settings.savePreferences")}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Additional Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t("settings.notificationPreferences")}
            </CardTitle>
            <CardDescription>
              {t("settings.notificationComingSoon")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("settings.additionalSoon")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.needHelp")}</CardTitle>
            <CardDescription>
              {t("settings.needHelpDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("settings.contactInfo")}
            </p>
            <div className="text-sm">
              <p className="font-medium mb-1">{t("settings.contactSupport")}</p>
              <p className="text-muted-foreground">
                {t("settings.contactSupport")} hhwjsw711@gmail.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
