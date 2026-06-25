import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  Sidebar,
  SidebarContent,
} from "~/components/ui/sidebar";
import { NavigationItems } from "./navigation-items";
import { UserMenu } from "./user-menu";
import type { Module, Progress, Segment } from "~/db/schema";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderModulesFn } from "~/fn/modules";
import { cn } from "~/lib/utils";
import { NewModuleButton } from "./new-module-button";
import { Link } from "@tanstack/react-router";
import { PanelLeftClose, PanelLeft, Home, LogOut, ShieldCheck } from "lucide-react";
import { ModeToggle } from "~/components/ModeToggle";
import { useSegment } from "./segment-context";
import { CourseProgressSearch } from "./course-progress-search";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface ModuleWithSegments extends Module {
  segments: Segment[];
}

interface DesktopNavigationProps {
  modules: ModuleWithSegments[];
  currentSegmentId: number;
  isAdmin: boolean;
  isPremium: boolean;
  progress: Progress[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DesktopNavigation({
  modules,
  currentSegmentId,
  progress,
  isAdmin,
  isPremium,
  isCollapsed = false,
  onToggleCollapse,
}: DesktopNavigationProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  // Filter modules based on search query
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) {
      return modules;
    }

    const query = searchQuery.toLowerCase().trim();

    return modules
      .map((module) => {
        // Filter segments that match the search query
        const matchingSegments = module.segments.filter((segment) =>
          segment.title.toLowerCase().includes(query)
        );

        // Also check if module title matches
        const moduleMatches = module.title.toLowerCase().includes(query);

        // If module title matches, show all segments
        if (moduleMatches) {
          return module;
        }

        // If has matching segments, return module with only those segments
        if (matchingSegments.length > 0) {
          return {
            ...module,
            segments: matchingSegments,
          };
        }

        return null;
      })
      .filter((module): module is ModuleWithSegments => module !== null);
  }, [modules, searchQuery]);

  const reorderMutation = useMutation({
    mutationFn: (updates: { id: number; order: number }[]) =>
      reorderModulesFn({ data: updates }),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["modules"] });
      const previousModules = queryClient.getQueryData<ModuleWithSegments[]>([
        "modules",
      ]);

      const optimisticModules = [...modules].sort((a, b) => {
        const aOrder = updates.find((u) => u.id === a.id)?.order ?? a.order;
        const bOrder = updates.find((u) => u.id === b.id)?.order ?? b.order;
        return aOrder - bOrder;
      });

      queryClient.setQueryData(["modules"], optimisticModules);
      return { previousModules };
    },
    onError: (err, newModules, context) => {
      queryClient.setQueryData(["modules"], context?.previousModules);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination || !isAdmin) return;

    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    reorderMutation.mutate(updates);
  };

  const { setCurrentSegmentId } = useSegment();

  // Get the first segment of each module for collapsed navigation
  const getFirstSegmentOfModule = (module: ModuleWithSegments) => {
    if (module.segments && module.segments.length > 0) {
      const sortedSegments = [...module.segments].sort((a, b) => a.order - b.order);
      return sortedSegments[0];
    }
    return null;
  };

  return (
    <Sidebar className={cn(
      "hidden lg:flex h-full sidebar-glass flex-col z-30 shrink-0 transition-all duration-300",
      isCollapsed ? "w-16" : "w-96"
    )}>
      <SidebarContent className="flex flex-col h-full bg-transparent">
        {/* Collapsed State */}
        {isCollapsed ? (
          <>
            {/* Top Section: Logo, Toggle, Theme */}
            <div className="flex flex-col items-center gap-3 p-3">
              <Link
                to="/"
                className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
              >
                <div className="bg-cyan-600/10 dark:bg-cyan-500/10 p-1.5 rounded-lg border border-cyan-600/30 dark:border-cyan-500/30">
                  <img
                    src="/logo.png"
                    alt={t("learn.automakerLogo")}
                    className="w-5 h-5"
                  />
                </div>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/analytics"
                  className="cursor-pointer p-2 rounded-lg glass hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  title={t("learn.adminPanel")}
                >
                  <ShieldCheck className="w-4 h-4" />
                </Link>
              )}
              <button
                onClick={onToggleCollapse}
                className="cursor-pointer p-2 rounded-lg glass hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                aria-label={t("learn.expandSidebar")}
              >
                <PanelLeft className="w-4 h-4" />
              </button>
              <ModeToggle />
            </div>

            {/* Middle Section: Module Numbers */}
            <nav className="flex-1 flex flex-col items-center gap-2 py-4 overflow-y-auto custom-scrollbar">
              {modules.map((module, index) => {
                const firstSegment = getFirstSegmentOfModule(module);
                const moduleHasCurrentSegment = module.segments.some(
                  (s) => s.id === currentSegmentId
                );
                return (
                  <button
                    key={module.id}
                    onClick={() => {
                      if (firstSegment) {
                        setCurrentSegmentId(firstSegment.id);
                      }
                    }}
                    className={cn(
                      "cursor-pointer w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all",
                      moduleHasCurrentSegment
                        ? "bg-cyan-600/20 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-600/30 dark:border-cyan-500/30"
                        : "glass text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                    )}
                    title={module.title}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </nav>

            {/* Bottom Section: Home & Logout */}
            <div className="flex flex-col items-center gap-2 p-3 border-t border-slate-200/60 dark:border-white/5">
              <Link
                to="/"
                className="p-2 rounded-lg glass hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                title={t("learn.home")}
              >
                <Home className="w-4 h-4" />
              </Link>
              <a
                href="/api/logout"
                className="p-2 rounded-lg glass hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                title={t("learn.logout")}
              >
                <LogOut className="w-4 h-4" />
              </a>
            </div>
          </>
        ) : (
          <>
            {/* Expanded State */}
            {/* Brand Header with Toggle */}
            <div className="flex items-center justify-between p-6 pb-4">
              <Link
                to="/"
                className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              >
                <div className="bg-cyan-600/10 dark:bg-cyan-500/10 p-1.5 rounded-lg border border-cyan-600/30 dark:border-cyan-500/30">
                  <img
                    src="/logo.png"
                    alt={t("learn.automakerLogo")}
                    className="w-5 h-5"
                  />
                </div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  {t("learn.automaker")}
                </h1>
              </Link>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin/analytics"
                    className="cursor-pointer p-2 rounded-lg glass hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                    title={t("learn.adminPanel")}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </Link>
                )}
                <ModeToggle />
                <button
                  onClick={onToggleCollapse}
                  className="cursor-pointer p-2 rounded-lg glass hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  aria-label={t("learn.collapseSidebar")}
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress and Search */}
            <CourseProgressSearch
              modules={modules}
              progress={progress}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Navigation Section */}
            <nav className="flex-1 space-y-8 overflow-y-auto custom-scrollbar px-0">
              <div>
                <p className="px-6 text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.2em] mb-3">
                  {t("learn.courseContent")}
                </p>
                <SidebarGroup className="py-0">
                  <SidebarGroupContent>
                    <SidebarMenu className="w-full space-y-0.5">
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="modules">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-0.5 w-full"
                            >
                              {filteredModules.map((module, index) => (
                                <Draggable
                                  key={module.id}
                                  draggableId={`module-${module.id}`}
                                  index={index}
                                  isDragDisabled={!isAdmin || !!searchQuery}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={cn(
                                        "relative",
                                        snapshot.isDragging && "z-50"
                                      )}
                                    >
                                      <NavigationItems
                                        modules={[module]}
                                        currentSegmentId={currentSegmentId}
                                        isAdmin={isAdmin}
                                        isPremium={isPremium}
                                        progress={progress}
                                        dragHandleProps={
                                          isAdmin && !searchQuery ? provided.dragHandleProps : undefined
                                        }
                                        className="w-full"
                                        searchQuery={searchQuery}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>

                      {isAdmin && <NewModuleButton />}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>
            </nav>

            {/* Footer Section */}
            <UserMenu />
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
