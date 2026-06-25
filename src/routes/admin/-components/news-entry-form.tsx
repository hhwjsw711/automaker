import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Badge } from "~/components/ui/badge";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createNewsEntryFn, updateNewsEntryFn } from "~/fn/news";
import { useState } from "react";

const newsEntrySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  url: z.string().url("Please enter a valid URL"),
  type: z.enum(["video", "blog", "changelog"], {
    required_error: "Please select a content type",
  }),
  imageUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  publishedAt: z.string().min(1, "Published date is required"),
  isPublished: z.boolean().default(true),
});

type NewsEntryFormData = z.infer<typeof newsEntrySchema>;

interface NewsEntryFormProps {
  entry?: any;
  availableTags: any[];
  onSuccess: () => void;
}

export function NewsEntryForm({
  entry,
  availableTags,
  onSuccess,
}: NewsEntryFormProps) {
  const { t } = useTranslation();
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    entry?.tags?.map((tag: any) => tag.id) || []
  );

  const formatDateForInput = (date: Date | string) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 16); // 'yyyy-MM-ddTHH:mm'
  };

  const form = useForm<NewsEntryFormData>({
    resolver: zodResolver(newsEntrySchema),
    defaultValues: {
      title: entry?.title || "",
      description: entry?.description || "",
      url: entry?.url || "",
      type: entry?.type || "blog",
      imageUrl: entry?.imageUrl || "",
      publishedAt: entry?.publishedAt
        ? formatDateForInput(entry.publishedAt)
        : formatDateForInput(new Date()),
      isPublished: entry?.isPublished ?? true,
    },
  });

  const createMutation = useMutation({
    mutationFn: createNewsEntryFn,
    onSuccess,
  });

  const updateMutation = useMutation({
    mutationFn: updateNewsEntryFn,
    onSuccess,
  });

  const onSubmit = (data: NewsEntryFormData) => {
    const formData = {
      ...data,
      publishedAt: new Date(data.publishedAt),
      tagIds: selectedTagIds,
      imageUrl: data.imageUrl || undefined,
      description: data.description || undefined,
    };

    if (entry) {
      updateMutation.mutate({
        data: {
          id: entry.id,
          updates: formData,
        },
      });
    } else {
      createMutation.mutate({ data: formData });
    }
  };

  const addTag = (tagId: number) => {
    if (!selectedTagIds.includes(tagId)) {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const removeTag = (tagId: number) => {
    setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin_pages.newsAdmin.titleLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("admin_pages.newsAdmin.titlePlaceholder")} {...field} />
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
              <FormLabel>{t("admin_pages.newsAdmin.descriptionLabel")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("admin_pages.newsAdmin.descriptionPlaceholder")}
                  rows={12}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("admin_pages.newsAdmin.descriptionHelp")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("admin_pages.newsAdmin.url")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("admin_pages.newsAdmin.urlPlaceholder")} {...field} />
                </FormControl>
                <FormDescription>
                  {t("admin_pages.newsAdmin.urlHelp")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("admin_pages.newsAdmin.contentType")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("admin_pages.newsAdmin.contentTypePlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="video">{t("admin_pages.newsAdmin.youtubeVideo")}</SelectItem>
                    <SelectItem value="blog">{t("admin_pages.newsAdmin.blogPost")}</SelectItem>
                    <SelectItem value="changelog">{t("admin_pages.newsAdmin.changelog")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin_pages.newsAdmin.imageUrlOptional")}</FormLabel>
              <FormControl>
                <Input placeholder={t("admin_pages.newsAdmin.imageUrlPlaceholder")} {...field} />
              </FormControl>
              <FormDescription>
                {t("admin_pages.newsAdmin.imageUrlHelp")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="publishedAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin_pages.newsAdmin.publishedDateTime")}</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormDescription>{t("admin_pages.newsAdmin.publishedDateTimeHelp")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>{t("admin_pages.newsAdmin.tags")}</FormLabel>
          <div className="space-y-3">
            {selectedTagIds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTagIds.map((tagId) => {
                  const tag = availableTags.find((t: any) => t.id === tagId);
                  if (!tag) return null;
                  return (
                    <Badge
                      key={tagId}
                      variant="outline"
                      className="flex items-center gap-1"
                      style={{ borderColor: tag.color, color: tag.color }}
                    >
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => removeTag(tagId)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}

            <Select onValueChange={(value) => addTag(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder={t("admin_pages.newsAdmin.addTagsPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {availableTags
                  .filter((tag: any) => !selectedTagIds.includes(tag.id))
                  .map((tag: any) => (
                    <SelectItem key={tag.id} value={tag.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {t("admin_pages.newsAdmin.tagsHelp")}
          </p>
        </div>

        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">{t("admin_pages.newsAdmin.published")}</FormLabel>
                <FormDescription>
                  {t("admin_pages.newsAdmin.publishedHelp")}
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

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? entry
                ? t("admin_pages.newsAdmin.updating")
                : t("admin_pages.newsAdmin.creating")
              : entry
                ? t("admin_pages.newsAdmin.updateEntry")
                : t("admin_pages.newsAdmin.createEntry")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
