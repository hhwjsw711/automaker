import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Page } from "~/routes/admin/-components/page";
import { PageHeader } from "~/routes/admin/-components/page-header";
import { Card, CardContent } from "~/components/ui/card";
import { AppCard } from "~/components/app-card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Switch } from "~/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import {
  getUserProfileFn,
  updateProfileFn,
  getProfileImageUploadUrlFn,
  getUserProjectsFn,
  createProjectFn,
  updateProjectFn,
  deleteProjectFn,
} from "~/fn/profiles";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  Upload,
  X,
  Plus,
  ExternalLink,
  Github,
  Save,
  Trash2,
  User,
  FolderOpen,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { authenticatedMiddleware } from "~/lib/auth";
import { assertAuthenticatedFn } from "~/fn/auth";

export const Route = createFileRoute("/profile/edit")({
  beforeLoad: () => assertAuthenticatedFn(),
  component: EditProfilePage,
});

function EditProfilePage() {
  const { t } = useTranslation();

  const profileFormSchema = z.object({
    displayName: z.string().min(1, t("profile.displayNameRequired")).max(100),
    realName: z.string().max(100).optional().or(z.literal("")),
    useDisplayName: z.boolean().optional(),
    bio: z.string().max(500).optional(),
    twitterHandle: z.string().max(50).optional(),
    githubHandle: z.string().max(50).optional(),
    websiteUrl: z
      .string()
      .url(t("profile.invalidUrl"))
      .optional()
      .or(z.literal("")),
    isPublicProfile: z.boolean().optional(),
  });

  const projectFormSchema = z.object({
    title: z.string().min(1, t("profile.titleRequired")).max(100),
    description: z.string().min(1, t("profile.descRequired")).max(500),
    imageUrl: z.string().url(t("profile.invalidUrl")).optional().or(z.literal("")),
    projectUrl: z
      .string()
      .url(t("profile.invalidUrl"))
      .optional()
      .or(z.literal("")),
    repositoryUrl: z
      .string()
      .url(t("profile.invalidUrl"))
      .optional()
      .or(z.literal("")),
    technologies: z.string().optional(),
    isVisible: z.boolean().optional(),
  });

  const queryClient = useQueryClient();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [editingProject, setEditingProject] = useState<number | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data: profile } = useSuspenseQuery({
    queryKey: ["profile", "user"],
    queryFn: () => getUserProfileFn(),
  });

  const { data: projects } = useSuspenseQuery({
    queryKey: ["projects", "user"],
    queryFn: () => getUserProjectsFn(),
  });

  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: profile?.displayName || "",
      realName: profile?.realName || "",
      useDisplayName: profile?.useDisplayName ?? true,
      bio: profile?.bio || "",
      twitterHandle: profile?.twitterHandle || "",
      githubHandle: profile?.githubHandle || "",
      websiteUrl: profile?.websiteUrl || "",
      isPublicProfile: profile?.isPublicProfile || false,
    },
  });

  const projectForm = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      projectUrl: "",
      repositoryUrl: "",
      technologies: "",
      isVisible: true,
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfileFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(t("profile.profileUpdated"), {
        description: t("profile.profileUpdatedDesc"),
      });
    },
    onError: () => {
      toast.error(t("profile.updateFailed"), {
        description: t("profile.updateFailedDesc"),
      });
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: createProjectFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsAddingProject(false);
      projectForm.reset();
      toast.success(t("profile.projectAdded"), {
        description: t("profile.projectAddedDesc"),
      });
    },
    onError: () => {
      toast.error(t("profile.actionFailed"), {
        description: t("profile.actionFailedDesc"),
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: updateProjectFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setEditingProject(null);
      toast.success(t("profile.projectUpdated"), {
        description: t("profile.projectUpdatedDesc"),
      });
    },
    onError: () => {
      toast.error(t("profile.actionFailed"), {
        description: t("profile.actionFailedDesc"),
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProjectFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(t("profile.projectDeleted"), {
        description: t("profile.projectDeletedDesc"),
      });
    },
    onError: () => {
      toast.error(t("profile.actionFailed"), {
        description: t("profile.actionFailedDesc"),
      });
    },
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const { presignedUrl, imageKey } =
        await getProfileImageUploadUrlFn({
          data: {
            fileName: file.name,
            contentType: file.type,
          },
        });

      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      await updateProfileMutation.mutateAsync({
        data: {
          imageId: imageKey,
        },
      });

      setPreviewImage(null);
    } catch (error) {
      toast.error(t("profile.uploadFailed"), {
        description: t("profile.uploadFailedDesc"),
      });
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    updateProfileMutation.mutate({ data });
  };

  const onProjectSubmit = (data: z.infer<typeof projectFormSchema>) => {
    const projectData = {
      ...data,
      technologies: data.technologies
        ? JSON.stringify(data.technologies.split(",").map((t) => t.trim()))
        : undefined,
    };

    if (editingProject) {
      updateProjectMutation.mutate({
        data: { id: editingProject, ...projectData },
      });
    } else {
      createProjectMutation.mutate({ data: projectData });
    }
  };

  return (
    <Page>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to="/profile/$userId"
                    params={{ userId: profile?.id?.toString() || "" }}
                  >
                    {t("profile.highlighted")}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("profile.editTitle")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Button variant="outline" size="sm" asChild>
            <Link
              to="/profile/$userId"
              params={{ userId: profile?.id?.toString() || "" }}
            >
              <Eye className="h-4 w-4 mr-2" />
              {t("profile.viewProfile")}
            </Link>
          </Button>
        </div>

        <PageHeader
          title={t("profile.editTitle")}
          highlightedWord={t("profile.highlighted")}
          description={t("profile.editDescription")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AppCard
              icon={User}
              title={t("profile.profileInformation")}
              description={t("profile.updateDetails")}
            >
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-6 p-6"
              >
                <div className="space-y-2">
                  <Label>{t("profile.profilePicture")}</Label>
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage
                        src={previewImage || profile?.image || undefined}
                        alt={t("profile.profileAlt")}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-theme-500 text-white text-2xl font-semibold">
                        {profile?.displayName
                          ? profile.displayName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploading}
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploading ? t("profile.uploading") : t("profile.uploadImage")}
                      </Button>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("profile.imageHint")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">{t("profile.displayName")} *</Label>
                    <Input
                      id="displayName"
                      {...profileForm.register("displayName")}
                      placeholder={t("profile.displayNamePlaceholder")}
                    />
                    {profileForm.formState.errors.displayName && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.displayName.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="useDisplayName" className="text-base">
                        {t("profile.useDisplayName")}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t("profile.useDisplayNameDesc")}
                      </p>
                    </div>
                    <Controller
                      name="useDisplayName"
                      control={profileForm.control}
                      render={({ field }) => (
                        <Switch
                          id="useDisplayName"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="realName">{t("profile.realName")}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="realName"
                        {...profileForm.register("realName")}
                        placeholder={t("profile.realNamePlaceholder")}
                      />
                      {profileForm.watch("realName") && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            profileForm.setValue("realName", "");
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("profile.realNameHint")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">{t("profile.bio")}</Label>
                    <Textarea
                      id="bio"
                      {...profileForm.register("bio")}
                      placeholder={t("profile.bioPlaceholder")}
                      rows={3}
                    />
                    {profileForm.formState.errors.bio && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.bio.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">{t("profile.website")}</Label>
                    <Input
                      id="websiteUrl"
                      {...profileForm.register("websiteUrl")}
                      placeholder={t("profile.websitePlaceholder")}
                    />
                    {profileForm.formState.errors.websiteUrl && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.websiteUrl.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitterHandle">{t("profile.twitter")}</Label>
                    <Input
                      id="twitterHandle"
                      {...profileForm.register("twitterHandle")}
                      placeholder={t("profile.twitterPlaceholder")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="githubHandle">{t("profile.github")}</Label>
                    <Input
                      id="githubHandle"
                      {...profileForm.register("githubHandle")}
                      placeholder={t("profile.githubPlaceholder")}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="isPublicProfile" className="text-base">
                        {t("profile.publicProfile")}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t("profile.publicProfileDesc")}
                      </p>
                    </div>
                    <Controller
                      name="isPublicProfile"
                      control={profileForm.control}
                      render={({ field }) => (
                        <Switch
                          id="isPublicProfile"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending
                      ? t("profile.saving")
                      : t("profile.saveProfile")}
                  </Button>
                </div>
              </form>
            </AppCard>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger
                  value="projects"
                  className="flex items-center gap-2"
                >
                  <FolderOpen className="h-4 w-4" />
                  {t("profile.projects")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="projects">
                <AppCard
                  icon={FolderOpen}
                  title={t("profile.projectsTitle")}
                  description={t("profile.projectsDesc")}
                  actions={
                    <Button
                      onClick={() => setIsAddingProject(true)}
                      disabled={isAddingProject}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t("profile.addProject")}
                    </Button>
                  }
                >
                  <div className="p-6">
                    {isAddingProject && (
                      <Card className="mb-6">
                        <CardContent className="p-4">
                          <form
                            onSubmit={projectForm.handleSubmit(onProjectSubmit)}
                            className="space-y-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="title">{t("profile.projectTitle")} *</Label>
                                <Input
                                  id="title"
                                  {...projectForm.register("title")}
                                  placeholder={t("profile.projectTitlePlaceholder")}
                                />
                                {projectForm.formState.errors.title && (
                                  <p className="text-sm text-destructive">
                                    {projectForm.formState.errors.title.message}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="technologies">
                                  {t("profile.technologies")}
                                </Label>
                                <Input
                                  id="technologies"
                                  {...projectForm.register("technologies")}
                                  placeholder={t("profile.technologiesPlaceholder")}
                                />
                                <p className="text-xs text-muted-foreground">
                                  {t("profile.technologiesHint")}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="projectUrl">
                                  {t("profile.demoUrl")}
                                </Label>
                                <Input
                                  id="projectUrl"
                                  {...projectForm.register("projectUrl")}
                                  placeholder={t("profile.demoUrlPlaceholder")}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="repositoryUrl">
                                  {t("profile.repoUrl")}
                                </Label>
                                <Input
                                  id="repositoryUrl"
                                  {...projectForm.register("repositoryUrl")}
                                  placeholder={t("profile.repoUrlPlaceholder")}
                                />
                              </div>

                              <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="imageUrl">{t("profile.imageUrl")}</Label>
                                <Input
                                  id="imageUrl"
                                  {...projectForm.register("imageUrl")}
                                  placeholder={t("profile.imageUrlPlaceholder")}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="description">{t("profile.projectDescription")} *</Label>
                              <Textarea
                                id="description"
                                {...projectForm.register("description")}
                                placeholder={t("profile.projectDescriptionPlaceholder")}
                                rows={3}
                              />
                              {projectForm.formState.errors.description && (
                                <p className="text-sm text-destructive">
                                  {
                                    projectForm.formState.errors.description
                                      .message
                                  }
                                </p>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Button
                                type="submit"
                                disabled={createProjectMutation.isPending}
                              >
                                {createProjectMutation.isPending
                                  ? t("profile.adding")
                                  : t("profile.addProject")}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsAddingProject(false);
                                  projectForm.reset();
                                }}
                              >
                                {t("profile.cancel")}
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    )}

                    {projects && projects.length > 0 ? (
                      <div className="space-y-4">
                        {projects.map((project) => (
                          <Card key={project.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">
                                    {project.title}
                                  </h3>
                                  <p className="text-muted-foreground text-sm mb-2">
                                    {project.description}
                                  </p>
                                  {project.technologies && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {JSON.parse(project.technologies).map(
                                        (tech: string, index: number) => (
                                          <Badge
                                            key={index}
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            {tech}
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  )}
                                  <div className="flex gap-2">
                                    {project.projectUrl && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        asChild
                                      >
                                        <a
                                          href={project.projectUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <ExternalLink className="h-3 w-3 mr-1" />
                                          {t("profile.demoBtn")}
                                        </a>
                                      </Button>
                                    )}
                                    {project.repositoryUrl && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        asChild
                                      >
                                        <a
                                          href={project.repositoryUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <Github className="h-3 w-3 mr-1" />
                                          {t("profile.codeBtn")}
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      setEditingProject(project.id)
                                    }
                                  >
                                    {t("profile.editBtn")}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      deleteProjectMutation.mutate({
                                        data: { id: project.id },
                                      })
                                    }
                                    disabled={deleteProjectMutation.isPending}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="space-y-4">
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-theme-100 to-theme-200 dark:from-theme-900 dark:to-theme-800 shadow-elevation-2 inline-block">
                            <FolderOpen className="h-8 w-8 text-theme-600 dark:text-theme-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold mb-2">
                              {t("profile.noProjects")}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {t("profile.noProjectsDesc")}
                            </p>
                            <Button
                              onClick={() => setIsAddingProject(true)}
                              disabled={isAddingProject}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              {t("profile.addFirstProject")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </AppCard>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Page>
  );
}
