import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Menu, Plus, ShieldCheck } from "lucide-react";
import type { Module, Progress, Segment } from "~/db/schema";
import { NavigationItems } from "./navigation-items";
import { UserMenu } from "./user-menu";
import { useState, useMemo } from "react";
import { useRouter } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { CourseProgressSearch } from "./course-progress-search";
import { useTranslation } from "react-i18next";

interface ModuleWithSegments extends Module {
  segments: Segment[];
}

interface MobileNavigationProps {
  modules: ModuleWithSegments[];
  currentSegmentId: number;
  isAdmin: boolean;
  isPremium: boolean;
  progress: Progress[];
}

export function MobileNavigation({
  modules,
  currentSegmentId,
  isAdmin,
  isPremium,
  progress,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden ml-6 mt-4 glass border-slate-200/60 dark:border-white/10">
          <Menu className="size-5" /> {t("learn.navigation")}
          <span className="sr-only">{t("learn.toggleMenu")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex flex-col sidebar-glass w-96 border-r border-slate-200/60 dark:border-white/[0.04]">
        <SheetTitle className="sr-only">{t("learn.courseNavigation")}</SheetTitle>
        {/* Brand Header */}
        <div className="p-6 pb-4 pr-14 flex items-center justify-between gap-2.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={() => setOpen(false)}
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
          {isAdmin && (
            <Link
              to="/admin/analytics"
              className="cursor-pointer p-2 rounded-lg glass hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex-shrink-0"
              title={t("learn.adminPanel")}
              onClick={() => setOpen(false)}
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Progress and Search */}
        <CourseProgressSearch
          modules={modules}
          progress={progress}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Navigation Section */}
        <nav className="flex-1 px-0 space-y-8 overflow-y-auto custom-scrollbar">
          <div>
            <p className="px-6 text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.2em] mb-3">
              {t("learn.courseContent")}
            </p>
            <div className="space-y-0.5">
              <NavigationItems
                modules={filteredModules}
                currentSegmentId={currentSegmentId}
                isAdmin={isAdmin}
                isPremium={isPremium}
                progress={progress}
                onItemClick={() => setOpen(false)}
                searchQuery={searchQuery}
              />
              {isAdmin && (
                <button
                  onClick={() => {
                    router.navigate({ to: "/learn/add" });
                    setOpen(false);
                  }}
                  className="cursor-pointer w-full flex items-center gap-3 px-6 py-3 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">{t("learn.addSegment")}</span>
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Footer Section */}
        <UserMenu />
      </SheetContent>
    </Sheet>
  );
}
