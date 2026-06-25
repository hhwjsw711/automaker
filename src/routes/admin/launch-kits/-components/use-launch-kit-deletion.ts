import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLaunchKitFn } from "~/fn/launch-kits";
import { toast } from "sonner";

export function useLaunchKitDeletion() {
  const { t } = useTranslation();
  const [deleteLaunchKitId, setDeleteLaunchKitId] = useState<number | null>(
    null
  );
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteLaunchKitFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "launch-kits"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "launch-kit-stats"],
      });
      toast.success(t("admin_pages.launchKitsAdmin.kitDeleted"));
      setDeleteLaunchKitId(null);
    },
    onError: (error: any) => {
      toast.error(error.message || t("admin_pages.launchKitsAdmin.deleteFailed"));
    },
  });

  const handleDeleteLaunchKit = (id: number) => {
    setDeleteLaunchKitId(id);
  };

  const confirmDeleteLaunchKit = () => {
    if (deleteLaunchKitId === null) return;
    deleteMutation.mutate({ data: { id: deleteLaunchKitId } });
  };

  const isDialogOpen = deleteLaunchKitId !== null;

  const closeDialog = () => {
    setDeleteLaunchKitId(null);
  };

  return {
    deleteLaunchKitId,
    isDialogOpen,
    handleDeleteLaunchKit,
    confirmDeleteLaunchKit,
    closeDialog,
    isDeleting: deleteMutation.isPending,
  };
}