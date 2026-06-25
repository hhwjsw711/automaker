import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Info } from "lucide-react";
import { CreateLaunchKitForm } from "./basic-information-card";

interface LinksMediaCardProps {
  form: UseFormReturn<CreateLaunchKitForm>;
  isLoading: boolean;
}

export function LinksMediaCard({ form, isLoading }: LinksMediaCardProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin_pages.launchKitsAdmin.linksMedia")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="repositoryUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin_pages.launchKitsAdmin.repoUrl")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("admin_pages.launchKitsAdmin.repoUrlPlaceholder")}
                  type="url"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="demoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin_pages.launchKitsAdmin.demoUrl")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("admin_pages.launchKitsAdmin.demoUrlPlaceholder")}
                  type="url"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin_pages.launchKitsAdmin.imageUrl")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("admin_pages.launchKitsAdmin.imageUrlPlaceholder")}
                  type="url"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-lg border border-border/50 bg-muted/50 p-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">{t("admin_pages.launchKitsAdmin.imageGuidelines")}:</p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>{t("admin_pages.launchKitsAdmin.imageSizeRec")}</li>
                <li>{t("admin_pages.launchKitsAdmin.imageFormat")}</li>
                <li>{t("admin_pages.launchKitsAdmin.imageShowcase")}</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}