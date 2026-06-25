import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Save, Eye, Info, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface WaitlistEmailEditorProps {
  form: ReturnType<typeof useForm<any>>;
  onSubmit: (data: any) => void;
  isSaving: boolean;
  showMarkdownGuide: boolean;
  setShowMarkdownGuide: (show: boolean) => void;
}

export function WaitlistEmailEditor({
  form,
  onSubmit,
  isSaving,
  showMarkdownGuide,
  setShowMarkdownGuide,
}: WaitlistEmailEditorProps) {
  const { t } = useTranslation();

  // Configure marked for preview
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Watch form values
  const subject = form.watch("subject");
  const content = form.watch("content");

  // Parse markdown to HTML for preview
  const htmlContent = useMemo(() => {
    if (!content) return "";
    try {
      return marked.parse(content, { async: false });
    } catch (error) {
      console.error("Failed to parse markdown:", error);
      return content;
    }
  }, [content]);

  const renderEmailPreview = () => {
    return (
      <div className="border rounded-lg p-6 bg-white dark:bg-gray-900">
        <div className="border-b pb-4 mb-4">
          <div className="text-sm text-muted-foreground mb-2">{t("admin_pages.emailAdmin.subject")}:</div>
          <div className="font-semibold">{subject || t("admin_pages.emailAdmin.noSubject")}</div>
        </div>
        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(htmlContent || `<p>${t("admin_pages.emailAdmin.noContent")}</p>`, {
              allowedTags: [
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "blockquote",
                "p",
                "a",
                "ul",
                "ol",
                "nl",
                "li",
                "b",
                "i",
                "strong",
                "em",
                "strike",
                "code",
                "hr",
                "br",
                "div",
                "table",
                "thead",
                "caption",
                "tbody",
                "tr",
                "th",
                "td",
                "pre",
                "span",
              ],
              allowedAttributes: {
                a: ["href", "name", "target"],
                img: ["src", "alt", "width", "height"],
                div: ["class"],
                span: ["class"],
                p: ["class"],
                "*": ["class"],
              },
              allowedSchemes: ["http", "https", "mailto"],
              allowedSchemesByTag: {},
              allowedSchemesAppliedToAttributes: ["href"],
            }),
          }}
        />
        <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
          <p>
            {t("admin_pages.emailAdmin.autoSentOnWaitlistJoin")}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Email Editor - 60% width */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("admin_pages.emailAdmin.waitlistWelcomeEmailTemplate")}</CardTitle>
            <CardDescription>
              {t("admin_pages.emailAdmin.waitlistWelcomeEmailTemplateDescription")}
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
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin_pages.emailAdmin.emailSubject")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("admin_pages.emailAdmin.waitlistSubjectPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>{t("admin_pages.emailAdmin.emailContentMarkdown")}</FormLabel>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowMarkdownGuide(!showMarkdownGuide)
                          }
                        >
                          <Info className="h-4 w-4 mr-1" />
                          {t("admin_pages.emailAdmin.markdownGuide")}
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder={t("admin_pages.emailAdmin.waitlistContentPlaceholder")}
                          className="min-h-[400px] font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {showMarkdownGuide && (
                  <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                    <p className="font-semibold">{t("admin_pages.emailAdmin.markdownQuickReference")}</p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • **Bold text** → <strong>Bold text</strong>
                      </li>
                      <li>
                        • *Italic text* → <em>Italic text</em>
                      </li>
                      <li>• # Heading 1 | ## Heading 2 | ### Heading 3</li>
                      <li>• [Link text](https://example.com)</li>
                      <li>• - Item 1 (for bullet lists)</li>
                      <li>• 1. Item 1 (for numbered lists)</li>
                      <li>• `code` for inline code</li>
                      <li>• --- for horizontal line</li>
                    </ul>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {t("admin_pages.emailAdmin.autoUnsubscribeLink")}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {t("admin_pages.emailAdmin.changesApplyToFutureSignups")}
                  </div>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("admin_pages.emailAdmin.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t("admin_pages.emailAdmin.saveTemplate")}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Email Preview - 40% width */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {t("admin_pages.emailAdmin.emailPreview")}
            </CardTitle>
            <CardDescription>
              {t("admin_pages.emailAdmin.livePreviewDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderEmailPreview()}</CardContent>
        </Card>
      </div>
    </div>
  );
}
