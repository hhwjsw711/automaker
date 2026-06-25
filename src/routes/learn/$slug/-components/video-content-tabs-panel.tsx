import { useState, useEffect } from "react";
import { FileText, MessageSquare, BookOpen } from "lucide-react";
import { cn } from "~/lib/utils";
import { type Segment } from "~/db/schema";
import { ContentPanel } from "./content-panel";
import { CommentsPanel } from "./comments-panel";
import { EditableContent } from "./editable-content";
import { GlassPanel } from "~/components/ui/glass-panel";
import { useTranslation } from "react-i18next";

type TabType = "summary" | "content" | "transcripts" | "comments";

interface VideoContentTabsPanelProps {
  currentSegment: Segment;
  isLoggedIn: boolean;
  defaultTab?: TabType;
  commentId?: number;
  isAdmin?: boolean;
  showContentTabs: boolean;
}

export function VideoContentTabsPanel({
  currentSegment,
  isLoggedIn,
  defaultTab,
  commentId,
  isAdmin,
  showContentTabs,
}: VideoContentTabsPanelProps) {
  const { t } = useTranslation();

  // Default to summary tab, fall back to comments if content tabs are disabled and trying to access content
  const effectiveDefaultTab =
    !showContentTabs && defaultTab === "content"
      ? "summary"
      : defaultTab || "summary";

  const [activeTab, setActiveTab] = useState<TabType>(effectiveDefaultTab);

  // Set active tab when defaultTab changes (from URL params)
  useEffect(() => {
    if (defaultTab) {
      // If content tabs are disabled and trying to set content, use summary instead
      if (!showContentTabs && defaultTab === "content") {
        setActiveTab("summary");
      } else {
        setActiveTab(defaultTab);
      }
    }
  }, [defaultTab, showContentTabs]);

  return (
    <GlassPanel variant="cyan">
      {/* Tab Headers */}
      <div className="flex border-b border-slate-200/60 dark:border-white/10">
        <button
          onClick={() => setActiveTab("summary")}
          className={cn(
            "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 cursor-pointer",
            activeTab === "summary"
              ? "border-cyan-600 dark:border-cyan-500 text-cyan-700 dark:text-cyan-400 bg-cyan-500/10"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
          )}
        >
          <BookOpen className="h-4 w-4" />
          {t("learn.summary")}
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={cn(
            "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 cursor-pointer",
            activeTab === "comments"
              ? "border-cyan-600 dark:border-cyan-500 text-cyan-700 dark:text-cyan-400 bg-cyan-500/10"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          {t("learn.discussion")}
        </button>
        {showContentTabs && (
          <button
            onClick={() => setActiveTab("content")}
            className={cn(
              "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 cursor-pointer",
              activeTab === "content"
                ? "border-cyan-600 dark:border-cyan-500 text-cyan-700 dark:text-cyan-400 bg-cyan-500/10"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            )}
          >
            <FileText className="h-4 w-4" />
            {t("learn.lessonContentTab")}
          </button>
        )}
        <button
          onClick={() => setActiveTab("transcripts")}
          className={cn(
            "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 cursor-pointer",
            activeTab === "transcripts"
              ? "border-cyan-600 dark:border-cyan-500 text-cyan-700 dark:text-cyan-400 bg-cyan-500/10"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
          )}
        >
          <FileText className="h-4 w-4" />
          {t("learn.transcriptsTab")}
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6 min-h-96">
        {activeTab === "summary" && (
          <EditableContent
            segmentId={currentSegment.id}
            field="summary"
            content={currentSegment.summary}
            isAdmin={isAdmin ?? false}
            emptyMessage="No summary available for this segment."
            emptyIcon={
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            }
          />
        )}

        {showContentTabs && activeTab === "content" && (
          <ContentPanel currentSegment={currentSegment} isAdmin={isAdmin} />
        )}

        {activeTab === "transcripts" && (
          <EditableContent
            segmentId={currentSegment.id}
            field="transcripts"
            content={currentSegment.transcripts}
            isAdmin={isAdmin ?? false}
            emptyMessage="No transcripts available for this segment."
            emptyIcon={
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            }
          />
        )}

        {activeTab === "comments" && (
          <CommentsPanel
            currentSegmentId={currentSegment.id}
            isLoggedIn={isLoggedIn}
            activeTab={activeTab}
            commentId={commentId}
          />
        )}
      </div>
    </GlassPanel>
  );
}
