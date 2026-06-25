import { toast } from "sonner";
import { cloneLaunchKitFn } from "~/fn/launch-kits";
import { useTranslation } from "react-i18next";

export function useCloneAction() {
  const { t } = useTranslation();

  const handleClone = async (kit: any) => {
    try {
      await cloneLaunchKitFn({ data: { slug: kit.slug } });
      toast.success(t("launchKits.cloneSuccess", { name: kit.name }));
      window.open(kit.repositoryUrl, "_blank");
    } catch (error) {
      toast.error(t("launchKits.cloneFailed"));
      window.open(kit.repositoryUrl, "_blank");
    }
  };

  return { handleClone };
}