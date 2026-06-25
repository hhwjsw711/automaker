import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { unauthenticatedMiddleware } from "~/lib/auth";
import { getSegments } from "~/data-access/segments";
import { Button, buttonVariants } from "~/components/ui/button";
import { isAdminFn } from "~/fn/auth";
import { ScrollAnimation } from "~/components/scroll-animation";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BookOpen,
  Play,
  Layers,
  Zap,
  Terminal,
  Database,
  Search,
  LayoutGrid,
} from "lucide-react";

const getSegmentsFn = createServerFn()
  .middleware([unauthenticatedMiddleware])
  .handler(async () => {
    return await getSegments();
  });

export const Route = createFileRoute("/learn/")({
  component: RouteComponent,
  loader: async () => {
    const isAdmin = await isAdminFn();
    const segments = await getSegmentsFn();
    return { isAdmin, segments };
  },
});

function PrismBackground() {
  return <div className="prism-bg" />;
}

const cardStyles =
  "kanban-card group glass hover:border-slate-300 dark:hover:border-white/[0.15] hover:shadow-2xl hover:shadow-cyan-500/10";

const buttonCyanStyles =
  "btn-cyan inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2 text-xs shadow-lg shadow-cyan-500/20";

const buttonGlassStyles =
  "glass inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white";

function RouteComponent() {
  const { isAdmin, segments } = Route.useLoaderData();
  const { t } = useTranslation();

  if (segments.length === 0) {
    return (
      <div className="flex w-full h-screen overflow-hidden bg-slate-50 dark:bg-[#0b101a] text-slate-800 dark:text-slate-200">
        <PrismBackground />

        {/* Main Content Area - full width when no sidebar */}
        <main className="flex-1 flex flex-col min-w-0 h-full">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200/60 dark:border-white/5 bg-white/60 dark:bg-[#0b101a]/40 backdrop-blur-md z-20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-600/10 dark:bg-cyan-500/10 p-1.5 rounded-lg border border-cyan-600/30 dark:border-cyan-500/30">
                <BookOpen className="w-5 h-5 text-cyan-700 dark:text-cyan-400 stroke-[2.5px]" />
              </div>
              <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("learn.courseOverview")}
                  </h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold font-mono">
                    {t("learn.noContent")}
                  </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/learn/add"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 dark:bg-[#22d3ee] px-6 py-2 text-xs font-black text-white dark:text-[#0b101a] shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                >
                  <BookOpen className="w-4 h-4 stroke-[3.5px]" />
                  {t("learn.createModule")}
                </Link>
              )}
              {!isAdmin && (
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-xl glass px-5 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  {t("learn.backToHome")}
                </Link>
              )}
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center">
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-2xl mx-auto text-center">
                <ScrollAnimation direction="down" delay={0}>
                  <div className="inline-flex items-center px-3 py-1.5 rounded-lg border border-cyan-600/30 dark:border-cyan-500/30 bg-cyan-600/10 dark:bg-cyan-500/10 mb-8 backdrop-blur-md">
                    <BookOpen className="w-4 h-4 mr-2 text-cyan-700 dark:text-cyan-400 stroke-[2.5px]" />
                    <span className="text-[11px] font-bold tracking-tight text-cyan-800 dark:text-cyan-100">
                      {t("learn.learningPlatform")}
                    </span>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation direction="up" delay={0.1}>
                  <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter text-slate-900 dark:text-white">
                    {isAdmin ? t("learn.readyToCreate") : t("learn.comingSoon")}
                    <span className="text-cyan-600 dark:text-[#22d3ee] block mt-2">
                      {isAdmin ? t("learn.buildFuture") : t("learn.stayTuned")}
                    </span>
                  </h1>
                </ScrollAnimation>

                <ScrollAnimation direction="up" delay={0.2}>
                  <p className="text-slate-600 dark:text-slate-400 mb-12 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium">
                    {isAdmin
                      ? t("learn.adminEmptyDesc")
                      : t("learn.nonAdminEmptyDesc")}
                  </p>
                </ScrollAnimation>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-slate-50 dark:bg-[#0b101a] text-slate-800 dark:text-slate-200">
      <PrismBackground />

      {/* Main Content Area - full width when no sidebar */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200/60 dark:border-white/5 bg-white/60 dark:bg-[#0b101a]/40 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-600/10 dark:bg-cyan-500/10 p-1.5 rounded-lg border border-cyan-600/30 dark:border-cyan-500/30">
              <BookOpen className="w-5 h-5 text-cyan-700 dark:text-cyan-400 stroke-[2.5px]" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {t("learn.courseOverview")}
                </h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold font-mono">
                  {t("learn.segmentsCount", { count: segments.length })}
                </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/learn/$slug`}
              params={{ slug: segments[0].slug }}
              className="inline-flex items-center gap-2 rounded-xl glass px-5 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
            >
                <Play className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 fill-cyan-600 dark:fill-cyan-400" />
                {t("learn.startLearning")}
              </Link>
              {isAdmin && (
                <Link
                  to="/learn/add"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 dark:bg-[#22d3ee] px-6 py-2 text-xs font-black text-white dark:text-[#0b101a] shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                >
                  <BookOpen className="w-4 h-4 stroke-[3.5px]" />
                  {t("learn.addModule")}
                </Link>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-5xl mx-auto text-center">
              <ScrollAnimation direction="up" delay={0.1}>
                <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter text-slate-900 dark:text-white">
                  {t("learn.welcomeTitle")}
                </h1>
              </ScrollAnimation>

              <ScrollAnimation direction="up" delay={0.2}>
                <p className="text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto text-base leading-relaxed font-medium">
                  {t("learn.welcomeDesc")}
                </p>
              </ScrollAnimation>

              <ScrollAnimation direction="up" delay={0.4}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto perspective-[1000px]">
                  <div className={cardStyles}>
                    <div className="w-12 h-12 rounded-xl bg-cyan-600/10 dark:bg-cyan-500/10 flex items-center justify-center mb-4 border border-cyan-600/20 dark:border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                      <Terminal className="w-6 h-6 text-cyan-600 dark:text-[#22d3ee]" />
                    </div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg tracking-tight">
                        {t("learn.interactiveLearning")}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {t("learn.interactiveDesc")}
                      </p>
                  </div>

                  <div className={cardStyles}>
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                      <LayoutGrid className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                    </div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg tracking-tight">
                        {t("learn.structuredModules")}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {t("learn.structuredDesc")}
                      </p>
                  </div>

                  <div className={cardStyles}>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                      <Zap className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                    </div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg tracking-tight">
                        {t("learn.expertGuidance")}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {t("learn.expertDesc")}
                      </p>
                  </div>
                </div>

                <div className="mt-10">
                  <Link
                    to={`/learn/$slug`}
                    params={{ slug: segments[0].slug }}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 dark:bg-[#22d3ee] px-8 py-3 text-sm font-black text-white dark:text-[#0b101a] shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105"
                  >
                      <Play className="w-4 h-4 fill-current" />
                      {t("learn.startLearning")}
                    </Link>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
