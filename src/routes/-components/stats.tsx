import { BookOpen, Play, Clock, Loader2 } from "lucide-react";
import type { CourseStats } from "~/use-cases/stats";
import { GlassPanel } from "~/components/ui/glass-panel";
import { DotPattern } from "~/components/ui/background-patterns";
import { useQuery } from "@tanstack/react-query";
import { getCourseStatsFn } from "~/fn/stats";

interface StatsProps {
  stats?: CourseStats;
}

export function StatsSection({ stats: initialStats }: StatsProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["course-stats"],
    queryFn: () => getCourseStatsFn(),
    initialData: initialStats,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  if (isLoading && !stats) {
    return (
      <div className="w-full py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!stats) return null;

  const statsData = [
    {
      icon: BookOpen,
      value: stats.totalModules,
      label: "Modules",
      description: "Comprehensive learning modules",
    },
    {
      icon: Play,
      value: stats.totalSegments,
      label: "Video Segments",
      description: "Bite-sized video lessons",
    },
    {
      icon: Clock,
      value: stats.totalVideoLength,
      label: "Total Content",
      description: "Hours of premium content",
    },
  ];

  return (
    <section className="relative w-full py-16 overflow-hidden bg-slate-50/80 dark:bg-slate-900/40">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.4]">
        <DotPattern
          width={24}
          height={24}
          cx={1}
          cy={1}
          cr={1}
          className="fill-cyan-600/20 dark:fill-cyan-500/20"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Course <span className="text-cyan-600 dark:text-cyan-400">Overview</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Comprehensive agentic coding curriculum designed to transform
              your development workflow
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <GlassPanel
                  key={index}
                  variant="cyan"
                  padding="lg"
                  className="group relative transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-cyan-600/10 dark:bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-600/20 dark:group-hover:bg-cyan-500/30 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Value */}
                  <div className="text-center mb-2">
                    <div className="text-4xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                      {stat.value}
                    </div>
                  </div>

                  {/* Label */}
                  <div className="text-center mb-3">
                    <div className="text-xl font-semibold text-cyan-600 dark:text-cyan-400">
                      {stat.label}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="text-center">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {stat.description}
                    </div>
                  </div>
                </GlassPanel>
              );
            })}
          </div>

          {/* Marketing Keywords Section - SEO Optimized */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold mb-8 text-slate-900 dark:text-white">
              Master the Latest{" "}
              <span className="text-cyan-600 dark:text-cyan-400">AI Coding Tools</span> &
              Technologies
            </h3>

            {/* Keywords Grid */}
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { text: "Cursor IDE", highlight: true },
                  { text: "Claude Code CLI", highlight: true },
                  { text: "Cursor Agent", highlight: false },
                  { text: "Opus 4.5", highlight: true },
                  { text: "Composer1", highlight: true },
                  { text: "GPT-5.1 Codex", highlight: true },
                  { text: "AI Pair Programming", highlight: false },
                  { text: "Agentic Development", highlight: false },
                  { text: "LLM Coding", highlight: false },
                  { text: "AI Code Generation", highlight: false },
                  { text: "Prompt Engineering", highlight: false },
                  { text: "AI Workflow Automation", highlight: false },
                  { text: "Claude API", highlight: false },
                  { text: "AI-First Development", highlight: true },
                  { text: "Code Assistant AI", highlight: false },
                  { text: "Windsurf IDE", highlight: false },
                  { text: "AI Coding Patterns", highlight: false },
                  { text: "MCP Servers", highlight: false },
                  { text: "Multi-Agent Systems", highlight: false },
                ].map((keyword, index) => (
                  <GlassPanel
                    key={index}
                    variant={keyword.highlight ? "cyan" : "default"}
                    padding="sm"
                    className="inline-block cursor-default transition-all duration-300 hover:scale-105"
                  >
                    <span className={`text-sm font-medium ${keyword.highlight ? "text-cyan-600 dark:text-cyan-400" : "text-slate-700 dark:text-slate-300"}`}>
                      {keyword.text}
                    </span>
                  </GlassPanel>
                ))}
              </div>
            </div>

            {/* Call to Action Text */}
            <p className="mt-10 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Join the{" "}
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                best agentic coding course
              </span>{" "}
              available and learn how to leverage cutting-edge AI models to
              build applications
              <span className="font-semibold text-slate-900 dark:text-white"> 10x faster</span> than
              traditional programming. Perfect for developers ready to master{" "}
              <span className="font-semibold text-slate-900 dark:text-white">AI-augmented development</span>{" "}
              and stay ahead in the rapidly evolving world of{" "}
              <span className="font-semibold text-slate-900 dark:text-white">AI coding assistants</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent dark:from-[#0b101a] dark:via-[#0b101a]/80"></div>
      <div className="section-divider-glow-bottom"></div>
    </section>
  );
}
