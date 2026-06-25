import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

export interface CreateLaunchKitForm {
  name: string;
  description: string;
  longDescription?: string;
  repositoryUrl: string;
  demoUrl?: string;
  imageUrl?: string;
  tagIds?: number[];
}

interface BasicInformationCardProps {
  form: UseFormReturn<CreateLaunchKitForm>;
  isLoading: boolean;
}

export function BasicInformationCard({ form, isLoading }: BasicInformationCardProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin_pages.launchKitsAdmin.basicInfo")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin_pages.launchKitsAdmin.name")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("admin_pages.launchKitsAdmin.namePlaceholder")}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin_pages.launchKitsAdmin.descriptionLabel")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("admin_pages.launchKitsAdmin.descriptionPlaceholder")}
                  disabled={isLoading}
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin_pages.launchKitsAdmin.longDescription")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("admin_pages.launchKitsAdmin.longDescriptionPlaceholder")}
                  disabled={isLoading}
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      </CardContent>
    </Card>
  );
}