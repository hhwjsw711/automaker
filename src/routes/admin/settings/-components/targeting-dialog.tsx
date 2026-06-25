import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "~/hooks/use-debounce";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { X, Check, Loader2, Users, Crown, UserX, UserCheck, ChevronDown, ChevronUp, Info, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { TARGET_MODES, type TargetMode, type FlagKey } from "~/config";
import {
  getFeatureFlagTargetingFn,
  updateFeatureFlagTargetingFn,
  searchUsersForFlagFn,
  getUsersByEmailsFn,
} from "~/fn/feature-flags";

interface TargetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flagKey: FlagKey;
  flagName: string;
}

interface SelectedUser {
  id: number;
  email: string | null;
  isPremium: boolean;
  isAdmin: boolean;
  displayName: string | null;
  image: string | null;
}

const TARGET_MODE_LABELS: Record<TargetMode, { label: string; icon: typeof Users }> = {
  [TARGET_MODES.ALL]: { label: "admin_pages.settingsAdmin.allUsers", icon: Users },
  [TARGET_MODES.PREMIUM]: { label: "admin_pages.settingsAdmin.premiumOnly", icon: Crown },
  [TARGET_MODES.NON_PREMIUM]: { label: "admin_pages.settingsAdmin.nonPremiumOnly", icon: UserX },
  [TARGET_MODES.CUSTOM]: { label: "admin_pages.settingsAdmin.customUsers", icon: UserCheck },
};

export function TargetingDialog({
  open,
  onOpenChange,
  flagKey,
  flagName,
}: TargetingDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [targetMode, setTargetMode] = useState<TargetMode>(TARGET_MODES.ALL);
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [bulkInput, setBulkInput] = useState("");
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Track whether user has made changes to prevent server data from overwriting
  const hasUserChangesRef = useRef(false);
  // Track whether we've done the initial sync for this dialog open
  const hasInitialSyncRef = useRef(false);

  const { data: targeting, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["featureFlagTargeting", flagKey],
    queryFn: () => getFeatureFlagTargetingFn({ data: { flagKey } }),
    enabled: open,
  });

  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: ["searchUsers", debouncedSearchQuery],
    queryFn: () => searchUsersForFlagFn({ data: { query: debouncedSearchQuery } }),
    enabled: debouncedSearchQuery.length >= 2,
  });

  const updateMutation = useMutation({
    mutationFn: updateFeatureFlagTargetingFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["featureFlagTargeting", flagKey] });
      queryClient.invalidateQueries({ queryKey: ["allFeatureFlags"] });
      toast.success(t("admin_pages.settingsAdmin.targetingUpdated"));
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(t("admin_pages.settingsAdmin.targetingUpdateFailed"));
      console.error("Failed to update targeting:", error);
    },
  });

  // Sync server data only on initial load, not on subsequent refetches if user has made changes
  useEffect(() => {
    if (targeting && !hasUserChangesRef.current && !hasInitialSyncRef.current) {
      setTargetMode(targeting.targetMode);
      setSelectedUsers(
        targeting.users.map((u) => ({
          id: u.userId,
          email: u.email,
          isPremium: u.isPremium,
          isAdmin: u.isAdmin ?? false,
          displayName: u.displayName ?? null,
          image: u.image ?? null,
        }))
      );
      hasInitialSyncRef.current = true;
    }
  }, [targeting]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setBulkInput("");
      setShowBulkAdd(false);
      setSearchOpen(false);
      // Reset tracking refs when dialog closes so next open gets fresh server data
      hasUserChangesRef.current = false;
      hasInitialSyncRef.current = false;
    }
  }, [open]);

  const handleAddUser = (user: SelectedUser) => {
    hasUserChangesRef.current = true;
    setSelectedUsers((prev) =>
      prev.find((u) => u.id === user.id) ? prev : [...prev, user]
    );
  };

  const handleRemoveUser = (userId: number) => {
    hasUserChangesRef.current = true;
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleBulkAdd = async () => {
    const emails = bulkInput
      .split(/[\n,;]/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    if (emails.length === 0) {
      toast.error(t("admin_pages.settingsAdmin.noValidEmails"));
      return;
    }

    setIsProcessingBulk(true);
    try {
      const users = await getUsersByEmailsFn({ data: { emails } });
      const existingIds = new Set(selectedUsers.map((u) => u.id));
      const newUsers = users.filter((u) => !existingIds.has(u.id));

      if (newUsers.length > 0) {
        hasUserChangesRef.current = true;
        setSelectedUsers([
          ...selectedUsers,
          ...newUsers.map((u) => ({
            id: u.id,
            email: u.email,
            isPremium: u.isPremium,
            isAdmin: u.isAdmin,
            displayName: u.displayName,
            image: u.image,
          })),
        ]);
        toast.success(t("admin_pages.settingsAdmin.addedUsers", { count: newUsers.length }));
      }

      const notFound = emails.length - users.length;
      if (notFound > 0) {
        toast.warning(t("admin_pages.settingsAdmin.emailsNotFound", { count: notFound }));
      }

      setBulkInput("");
    } catch (error) {
      toast.error(t("admin_pages.settingsAdmin.failedLookupUsers"));
    } finally {
      setIsProcessingBulk(false);
    }
  };

  const handleSave = () => {
    updateMutation.mutate({
      data: {
        flagKey,
        targetMode,
        userIds: targetMode === TARGET_MODES.CUSTOM ? selectedUsers.map((u) => u.id) : undefined,
      },
    });
  };

  const searchResultsWithSelection = searchResults ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {t("admin_pages.settingsAdmin.configureTargeting", { flagName })}
            </DialogTitle>
            <DialogDescription className="text-base">
              {t("admin_pages.settingsAdmin.chooseAccess")}
            </DialogDescription>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2 mt-2">
              <Info className="h-3.5 w-3.5 shrink-0" />
              <span>{t("admin_pages.settingsAdmin.adminsAlwaysAccess")}</span>
            </div>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <p className="text-sm mb-2">{t("admin_pages.settingsAdmin.failedLoadTargeting")}.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                {t("admin_pages.settingsAdmin.retry")}
              </Button>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <Label className="shrink-0">{t("admin_pages.settingsAdmin.targetMode")}</Label>
                <Select
                  value={targetMode}
                  onValueChange={(v) => {
                    hasUserChangesRef.current = true;
                    setTargetMode(v as TargetMode);
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TARGET_MODE_LABELS).map(([mode, { label, icon: Icon }]) => (
                      <SelectItem key={mode} value={mode}>
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {t(label)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {targetMode === TARGET_MODES.CUSTOM && (
                <div className="space-y-4">
                  {/* Spotlight-style user search with badges */}
                  <div className="space-y-2">
                    <Label>{t("admin_pages.settingsAdmin.selectUsers")}</Label>
                    <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                      <PopoverTrigger asChild>
                        <div
                          role="combobox"
                          tabIndex={0}
                           aria-label={t("admin_pages.settingsAdmin.searchAndSelectUsers")}
                          aria-expanded={searchOpen}
                          aria-haspopup="listbox"
                          className={cn(
                            "flex gap-1.5 min-h-[42px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-text focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 overflow-hidden",
                            searchOpen ? "flex-wrap items-start" : "items-center"
                          )}
                          onClick={() => setSearchOpen(true)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSearchOpen(true);
                            }
                          }}
                        >
                          {(searchOpen ? selectedUsers : selectedUsers.slice(0, 3)).map((user) => (
                            <Badge
                              key={user.id}
                              variant="secondary"
                              className="flex items-center gap-1 pr-1 shrink-0"
                            >
                              <span className="max-w-[120px] truncate">{user.email}</span>
                              <button
                                type="button"
                                aria-label={t("admin_pages.settingsAdmin.removeUser", { email: user.email })}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveUser(user.id);
                                }}
                                className="ml-0.5 hover:bg-destructive/20 hover:text-destructive rounded-full p-0.5 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                          {!searchOpen && selectedUsers.length > 3 && (
                            <Badge variant="outline" className="shrink-0">
                              +{selectedUsers.length - 3} {t("admin_pages.settingsAdmin.more")}
                            </Badge>
                          )}
                          <span className="text-muted-foreground truncate">
                            {selectedUsers.length === 0 ? t("admin_pages.settingsAdmin.searchUsersByEmail") : t("admin_pages.settingsAdmin.addMore")}
                          </span>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[var(--radix-popover-trigger-width)] p-0"
                        align="start"
                      >
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder={t("admin_pages.settingsAdmin.typeToSearch")}
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                          />
                          <CommandList>
                            {debouncedSearchQuery.length < 2 ? (
                              <div className="py-6 text-center text-sm text-muted-foreground">
                                {t("admin_pages.settingsAdmin.typeToSearchHint")}
                              </div>
                            ) : isSearching ? (
                              <div aria-live="polite" className="py-6 text-center text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                                {t("admin_pages.settingsAdmin.searching")}
                              </div>
                            ) : searchResultsWithSelection.length === 0 ? (
                              <CommandEmpty>{t("admin_pages.settingsAdmin.noUsersFound")}</CommandEmpty>
                            ) : (
                              <CommandGroup>
                                {searchResultsWithSelection.slice(0, 6).map((user) => {
                                  const isSelected = selectedUsers.some((u) => u.id === user.id);
                                  return (
                                    <CommandItem
                                      key={user.id}
                                      value={`user-${user.id}`}
                                      onSelect={() => {
                                        if (isSelected) {
                                          handleRemoveUser(user.id);
                                        } else {
                                          handleAddUser({
                                            id: user.id,
                                            email: user.email,
                                            isPremium: user.isPremium,
                                            isAdmin: user.isAdmin,
                                            displayName: user.displayName,
                                            image: user.image,
                                          });
                                        }
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4 shrink-0",
                                          isSelected ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <Avatar className="h-6 w-6 mr-2 shrink-0">
                                        <AvatarImage src={user.image ?? undefined} />
                                        <AvatarFallback className="text-xs">
                                          {(user.displayName ?? user.email ?? "?")[0]?.toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex flex-col min-w-0 flex-1">
                                        {user.displayName && (
                                          <span className="text-sm truncate">{user.displayName}</span>
                                        )}
                                        <span className={cn("truncate", user.displayName ? "text-xs text-muted-foreground" : "text-sm")}>
                                          {user.email}
                                        </span>
                                      </div>
                                      <div className="flex gap-1 ml-2 shrink-0">
                                        {user.isAdmin && (
                                          <Badge variant="destructive" className="text-xs px-1.5">
                                            <Shield className="h-3 w-3" />
                                          </Badge>
                                        )}
                                        {user.isPremium && (
                                          <Badge variant="secondary" className="text-xs px-1.5">
                                            <Crown className="h-3 w-3" />
                                          </Badge>
                                        )}
                                      </div>
                                    </CommandItem>
                                  );
                                })}
                                {searchResultsWithSelection.length > 6 && (
                                  <div className="py-2 px-2 text-xs text-muted-foreground text-center border-t">
                                    +{searchResultsWithSelection.length - 6} {t("admin_pages.settingsAdmin.moreResults")}
                                  </div>
                                )}
                              </CommandGroup>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {selectedUsers.length > 0 && (
                        <p aria-live="polite" className="text-xs text-muted-foreground">
                        {t(selectedUsers.length === 1 ? "admin_pages.settingsAdmin.userSelectedSingular" : "admin_pages.settingsAdmin.usersSelectedPlural", { count: selectedUsers.length })}
                      </p>
                    )}
                  </div>

                  {/* Bulk Add - collapsible */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      aria-expanded={showBulkAdd}
                      onClick={() => setShowBulkAdd(!showBulkAdd)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showBulkAdd ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      {t("admin_pages.settingsAdmin.bulkAddFromEmailList")}
                    </button>
                    {showBulkAdd && (
                      <div className="space-y-2 pl-6">
                        <Textarea
                          placeholder={t("admin_pages.settingsAdmin.pasteEmails")}
                          value={bulkInput}
                          onChange={(e) => setBulkInput(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleBulkAdd}
                          disabled={!bulkInput.trim() || isProcessingBulk}
                        >
                          {isProcessingBulk ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              {t("admin_pages.settingsAdmin.processing")}
                            </>
                          ) : (
                            t("admin_pages.settingsAdmin.addUsers")
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("admin_pages.settingsAdmin.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending || isLoading || isError}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t("admin_pages.settingsAdmin.saving")}
                </>
              ) : (
                t("admin_pages.settingsAdmin.saveChanges")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
