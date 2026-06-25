import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import {
  Loader2,
  FileText,
  Bot,
  Code,
  Zap,
  Eye,
  Edit,
  LucideIcon,
} from "lucide-react";

function createAgentFormSchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string()
      .min(2, t("agentForm.validation.nameMin"))
      .max(100, t("agentForm.validation.nameMax")),
    description: z
      .string()
      .min(10, t("agentForm.validation.descriptionMin"))
      .max(500, t("agentForm.validation.descriptionMax")),
    type: z.enum(["agent", "command", "hook"]),
    content: z.string().min(10, t("agentForm.validation.contentMin")),
    isPublic: z.boolean().optional().default(true),
  });
}

type AgentFormValues = z.infer<ReturnType<typeof createAgentFormSchema>>;

export type { AgentFormValues };

interface AgentFormProps {
  headerTitle?: string;
  headerDescription?: string;
  buttonText: string;
  loadingText: string;
  buttonIcon?: LucideIcon;
  defaultValues?: Partial<AgentFormValues>;
  onSubmit: (values: AgentFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function AgentForm({
  headerTitle,
  headerDescription,
  buttonText,
  loadingText,
  buttonIcon: ButtonIcon = Edit,
  defaultValues,
  onSubmit,
  isSubmitting,
}: AgentFormProps) {
  const { t } = useTranslation();
  const schema = createAgentFormSchema(t);
  type SchemaType = z.infer<typeof schema>;

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      type: (defaultValues?.type as "agent" | "command" | "hook") || "agent",
      content: defaultValues?.content || "",
      isPublic: defaultValues?.isPublic ?? true,
    },
  });

  const currentContent = form.watch("content");
  const currentType = form.watch("type");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "agent":
        return <Bot className="h-4 w-4" />;
      case "command":
        return <Code className="h-4 w-4" />;
      case "hook":
        return <Zap className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const getTypeDescription = (type: string) => {
    switch (type) {
      case "agent":
        return t("agentForm.typeAgentDesc");
      case "command":
        return t("agentForm.typeCommandDesc");
      case "hook":
        return t("agentForm.typeHookDesc");
      default:
        return t("agentForm.typeSelectDesc");
    }
  };

  return (
    <div className="">
      {/* Header Section */}
      {headerTitle && headerDescription && (
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">{headerTitle}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {headerDescription}
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-6 col-span-2">
              {/* Content */}
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-theme-500" />
                    {t("agentForm.agentContent")}
                  </CardTitle>
                  <CardDescription>
                    {t("agentForm.agentContentDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("agentForm.markdownContent")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("agentForm.markdownPlaceholder")}
                            className="min-h-[400px] font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("agentForm.writeInstructions")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Basic Information */}
            <div className="col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5 text-orange-500" />
                    {t("agentForm.basicInformation")}
                  </CardTitle>
                  <CardDescription>
                    {t("agentForm.basicInfoDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("agentForm.agentName")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("agentForm.agentNamePlaceholder")}
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
                        <FormLabel>{t("agentForm.description")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("agentForm.descriptionPlaceholder")}
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("agentForm.descriptionHelp")}
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
                        <FormLabel>{t("agentForm.agentType")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("agentForm.selectType")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="agent">
                              <div className="flex items-center gap-2">
                                <Bot className="h-4 w-4" />
                                {t("agentForm.typeAgent")}
                              </div>
                            </SelectItem>
                            <SelectItem value="command">
                              <div className="flex items-center gap-2">
                                <Code className="h-4 w-4" />
                                {t("agentForm.typeCommand")}
                              </div>
                            </SelectItem>
                            <SelectItem value="hook">
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                {t("agentForm.typeHook")}
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {getTypeDescription(currentType)}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {t("agentForm.publicAgent")}
                          </FormLabel>
                          <FormDescription>
                            {t("agentForm.publicAgentDesc")}
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
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingText}
              </>
            ) : (
              <>
                <ButtonIcon className="mr-2 h-4 w-4" />
                {buttonText}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
