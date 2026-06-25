import { Search } from "lucide-react";
import type { Module, Progress, Segment } from "~/db/schema";
import { useTranslation } from "react-i18next";

interface ModuleWithSegments extends Module {
  segments: Segment[];
}

interface CourseProgressSearchProps {
  modules: ModuleWithSegments[];
  progress: Progress[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CourseProgressSearch({
  modules,
  progress,
  searchQuery,
  onSearchChange,
}: CourseProgressSearchProps) {
  const { t } = useTranslation();
  // Calculate total segments and completed segments
  const totalSegments = modules.reduce(
    (acc, module) => acc + (module.segments?.length || 0),
    0
  );
  const completedSegments = progress.length;
  const progressPercentage =
    totalSegments > 0 ? (completedSegments / totalSegments) * 100 : 0;

  return (
    <div className="px-6 pb-4 space-y-4">
      {/* Progress Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {t("learn.yourProgress")}
          </span>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            {completedSegments}/{totalSegments}
          </span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200/60 dark:bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-600 dark:from-cyan-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Search Section */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("learn.searchLessons")}
          className="w-full h-10 pl-10 pr-4 rounded-full bg-transparent border border-slate-300/60 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
        />
      </div>
    </div>
  );
}
