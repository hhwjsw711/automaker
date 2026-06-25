import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import { useRouter, Link } from "@tanstack/react-router";
import { createTestimonialUseCase } from "~/use-cases/testimonials";
import { authenticatedMiddleware } from "~/lib/auth";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "~/components/ui/checkbox";
import { useTranslation } from "react-i18next";

const emojis = [
  "😊",
  "👍",
  "🌟",
  "💯",
  "🔥",
  "🚀",
  "💪",
  "🎉",
  "💡",
  "❤️",
  "👏",
  "🙌",
  "🎯",
  "✨",
  "💫",
  "⭐",
  "💖",
  "💝",
  "💗",
  "🙏",
];

const testimonialSchemaFn = (tr: (key: string) => string = (k) => k) =>
  z.object({
    displayName: z.string().min(1, tr("testimonial.displayNameRequired")),
    content: z.string().min(10, tr("testimonial.contentRequired")),
    emojis: z.string().min(1, tr("testimonial.emojisRequired")),
    permissionGranted: z.boolean().refine((val) => val === true, {
      message: tr("testimonial.permissionRequired"),
    }),
  });

const testimonialSchema = testimonialSchemaFn();

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export const Route = createFileRoute("/create-testimonial")({
  component: CreateTestimonial,
});

export const createTestimonialFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .inputValidator(testimonialSchemaFn())
  .handler(async ({ data, context }) => {
    await createTestimonialUseCase({
      ...data,
      userId: context.userId,
    });
  });

function SuccessMessage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto p-6 text-center space-y-6 mt-12">
      <h1 className="text-3xl font-bold">{t("testimonial.thankYou")}</h1>
      <p className="text-muted-foreground">{t("testimonial.feedbackValue")}</p>
      <div className="flex justify-center gap-4">
        <Link
          to="/"
          hash="testimonials"
          className={buttonVariants({ variant: "default" })}
        >
          {t("testimonial.viewYourTestimonial")}
        </Link>
      </div>
    </div>
  );
}

function CreateTestimonial() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchemaFn(t)),
    defaultValues: {
      displayName: "",
      content: "",
      emojis: "",
      permissionGranted: false,
    },
  });

  const toggleEmoji = (emoji: string) => {
    let newEmojis: string[];
    if (selectedEmojis.includes(emoji)) {
      newEmojis = selectedEmojis.filter((e) => e !== emoji);
    } else if (selectedEmojis.length < 3) {
      newEmojis = [...selectedEmojis, emoji];
    } else {
      return; // Don't allow more than 3 emojis
    }
    setSelectedEmojis(newEmojis);
    form.setValue("emojis", newEmojis.join(""), {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit = async (values: TestimonialFormValues) => {
    if (selectedEmojis.length === 0) {
      form.setError("emojis", {
        type: "manual",
        message: t("testimonial.emojisRequired"),
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await createTestimonialFn({
        data: {
          displayName: values.displayName,
          content: values.content,
          emojis: selectedEmojis.join(""),
          permissionGranted: values.permissionGranted,
        },
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit testimonial:", error);
      toast.error(t("testimonial.submitError"), {
        description: t("testimonial.submitErrorDesc"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return <SuccessMessage />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 my-12">
      <h1 className="text-3xl font-bold mb-8">{t("testimonial.shareYourExperience")}</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="displayName" className="text-sm font-medium">
            {t("testimonial.displayName")} <span className="text-destructive">*</span>
          </label>
          <Input
            id="displayName"
            {...form.register("displayName")}
            placeholder={t("testimonial.displayNamePlaceholder")}
            className={cn(
              form.formState.errors.displayName &&
                "border-destructive focus-visible:ring-destructive"
            )}
          />
          {form.formState.errors.displayName && (
            <p className="text-sm text-destructive">
              {form.formState.errors.displayName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            {t("testimonial.yourTestimonial")} <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="content"
            {...form.register("content")}
            placeholder={t("testimonial.testimonialPlaceholder")}
            className={cn(
              "min-h-[150px]",
              form.formState.errors.content &&
                "border-destructive focus-visible:ring-destructive"
            )}
          />
          {form.formState.errors.content && (
            <p className="text-sm text-destructive">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("testimonial.selectEmojis")}
          </label>
          <div className="flex flex-wrap gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => toggleEmoji(emoji)}
                className={cn(
                  "text-2xl p-2 rounded-lg transition-colors",
                  selectedEmojis.includes(emoji)
                    ? "bg-theme-500/20 text-theme-500"
                    : "hover:bg-muted dark:hover:bg-muted"
                )}
              >
                {emoji}
              </button>
            ))}
          </div>
          {selectedEmojis.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {t("testimonial.selected")}: {selectedEmojis.join(" ")}
            </p>
          )}
          {form.formState.errors.emojis && (
            <p className="text-sm text-destructive">
              {form.formState.errors.emojis.message}
            </p>
          )}
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="permission"
            checked={form.watch("permissionGranted")}
            onCheckedChange={(checked) => {
              form.setValue("permissionGranted", checked === true, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
            className={cn(
              form.formState.errors.permissionGranted && "border-destructive"
            )}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="permission"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("testimonial.permissionLabel")} <span className="text-destructive">*</span>
            </label>
            <p className="text-sm text-muted-foreground">
              {t("testimonial.permissionText")}
            </p>
            {form.formState.errors.permissionGranted && (
              <p className="text-sm text-destructive">
                {form.formState.errors.permissionGranted.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("testimonial.submitting") : t("testimonial.submitTestimonial")}
        </Button>
      </form>
    </div>
  );
}
