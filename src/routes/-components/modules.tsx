import { Link } from "@tanstack/react-router";
import { type Segment } from "~/db/schema";
import { Badge } from "~/components/ui/badge";
import {
  Lock,
  Play,
  CheckCircle,
  Circle,
  BookOpen,
  Code,
  Brain,
  Rocket,
  Loader2,
} from "lucide-react";
import { Stat } from "~/components/ui/stat";
import { createServerFn } from "@tanstack/react-start";
import { getModules } from "~/data-access/modules";
import { useQuery } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { GlassPanel } from "~/components/ui/glass-panel";
import { GridPattern } from "~/components/ui/background-patterns";
import { getSegmentsFn } from "~/fn/segments";

function formatDuration(durationInMinutes: number) {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = Math.round(durationInMinutes % 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function calculateDuration(segments: Segment[]) {
  return segments.reduce((acc, segment) => {
    if (!segment.length) return acc;
    const [minutes, seconds] = segment.length.split(":").map(Number);
    return acc + minutes + seconds / 60;
  }, 0);
}

export const getModulesFn = createServerFn().handler(async ({ context }) => {
  const modules = await getModules();
  return modules;
});

const getModuleIcon = (moduleId: string) => {
  switch (moduleId) {
    case "1":
      return <BookOpen className="w-6 h-6" />;
    case "2":
      return <Code className="w-6 h-6" />;
    case "3":
      return <Brain className="w-6 h-6" />;
    default:
      return <Rocket className="w-6 h-6" />;
  }
};

export function ModulesSection({
  segments: initialSegments,
  isDisabled = false,
}: {
  segments?: Segment[];
  isDisabled?: boolean;
}) {
  const { data: segments, isLoading: isLoadingSegments } = useQuery({
    queryKey: ["segments"],
    queryFn: () => getSegmentsFn(),
    initialData: initialSegments,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const { data: moduleData, isLoading: isLoadingModules } = useQuery({
    queryKey: ["modules"],
    queryFn: getModulesFn,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  if ((isLoadingSegments || isLoadingModules) && !segments) {
    return (
      <div className="w-full py-24 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!segments) return null;

  // Group segments by moduleId
  const modules = segments.reduce(
    (acc, segment) => {
      if (!acc[segment.moduleId]) {
        acc[segment.moduleId] = [];
      }
      acc[segment.moduleId].push(segment);
      return acc;
    },
    {} as Record<string, Segment[]>
  );

  // Sort segments within each module by order
  Object.keys(modules).forEach((moduleId) => {
    modules[moduleId].sort((a, b) => a.order - b.order);
  });

  const moduleEntries = Object.entries(modules);

  // Calculate total duration
  const totalDurationMinutes = calculateDuration(segments);
  const formattedTotalDuration = formatDuration(totalDurationMinutes);

  return (
    <section className="relative w-full py-12 md:py-24 bg-slate-100/50 dark:bg-[#0d121f]">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.3]">
        <GridPattern
          width={30}
          height={30}
          x={-1}
          y={-1}
          className="stroke-gray-300/30 fill-gray-300/30 dark:stroke-gray-600/30 dark:fill-gray-600/30"
          squares={[
            [2, 5],
            [10, 2],
            [15, 10],
          ]}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          {/* Section header */}
          <div className="text-center mb-8 md:mb-16">
            {/* Badge - matching hero style */}
            <GlassPanel variant="cyan" padding="sm" className="inline-block mb-6 md:mb-8">
              <div className="inline-flex items-center text-xs md:text-sm font-medium text-slate-700 dark:text-cyan-400">
                <span className="w-2 h-2 bg-cyan-600 dark:bg-cyan-400 rounded-full mr-2"></span>
                Everyone can be a 10x developer
              </div>
            </GlassPanel>

            <h2 className="text-3xl md:text-4xl lg:text-6xl leading-tight mb-6 md:mb-8 text-slate-900 dark:text-white">
              The Perfect Curriculum to{" "}
              <span className="text-cyan-600 dark:text-cyan-400">Master Agentic Coding</span>
            </h2>

            <p className="text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-400 mb-8 md:mb-12 max-w-4xl mx-auto">
              Learn to leverage AI tools like Cursor, Claude Code, and
              advanced models to build applications faster than ever. From
              setup to deployment, master the complete AI-assisted development
              workflow.
            </p>
          </div>

          {/* Module progression */}
          <div className="mb-8 md:mb-16">
            <div className="space-y-6 md:space-y-8">
              {moduleEntries.map(([moduleId, moduleSegments], index) => {
                const moduleInfo = moduleData?.find(
                  (m) => m.id === Number(moduleId)
                );
                const moduleDurationMinutes = calculateDuration(moduleSegments);
                const formattedModuleDuration = formatDuration(
                  moduleDurationMinutes
                );

                return (
                  <div
                    key={moduleId}
                    className="relative"
                  >
                    {/* Connector line */}
                    {index < moduleEntries.length - 1 && (
                      <div className="absolute left-6 md:left-8 top-16 md:top-20 w-px h-12 md:h-16 bg-gradient-to-b from-cyan-300 to-cyan-100 dark:from-cyan-700 dark:to-cyan-900"></div>
                    )}

                    <div className="flex gap-3 md:gap-6">
                      {/* Module indicator */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 md:border-4 border-cyan-600 dark:border-cyan-400 bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                          <div className="text-cyan-600 dark:text-cyan-400 scale-75 md:scale-100">
                            {getModuleIcon(moduleId)}
                          </div>
                        </div>
                      </div>

                      {/* Module content */}
                      <GlassPanel variant="cyan" padding="lg" className="flex-grow">
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4">
                          <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
                            {moduleInfo?.title || `Module ${moduleId}`}
                          </h4>
                          <Badge
                            variant="outline"
                            className="text-cyan-600 dark:text-cyan-400 border-cyan-600/30 dark:border-cyan-400/30"
                          >
                            {formattedModuleDuration}
                          </Badge>
                          <Badge className="bg-cyan-600/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-600/30 dark:border-cyan-500/30">
                            {moduleSegments.length} lessons
                          </Badge>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 mb-4 md:mb-6 text-sm md:text-base lg:text-lg leading-relaxed">
                          Learn essential AI development skills and master
                          cutting-edge tools in this comprehensive module.
                        </p>

                        {/* Lessons grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                          {moduleSegments.map((segment, segmentIndex) => {
                            const lessonContent = (
                              <>
                                <div className="flex-shrink-0 mt-1">
                                  <Circle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <div className="flex-grow">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">
                                      {segment.title}
                                    </span>
                                    {segment.isComingSoon ? (
                                      <Badge
                                        variant="outline"
                                        className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800 text-xs"
                                      >
                                        COMING SOON
                                      </Badge>
                                    ) : !segment.isPremium ? (
                                      <Badge
                                        variant="outline"
                                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 text-xs"
                                      >
                                        FREE
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1 text-xs"
                                      >
                                        <Lock className="w-3 h-3" />
                                        PREMIUM
                                      </Badge>
                                    )}
                                  </div>
                                  {segment.length && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {segment.length}
                                    </p>
                                  )}
                                </div>
                              </>
                            );

                            if (isDisabled) {
                              return (
                                <GlassPanel
                                  key={segment.id}
                                  variant="default"
                                  padding="sm"
                                  className="opacity-60 cursor-not-allowed"
                                >
                                  <div className="group/lesson flex items-start gap-2 md:gap-3">
                                    {lessonContent}
                                  </div>
                                </GlassPanel>
                              );
                            }

                            return (
                              <Link
                                key={segment.id}
                                to="/learn/$slug"
                                params={{ slug: segment.slug }}
                                className="block"
                              >
                                <GlassPanel
                                  variant="default"
                                  padding="sm"
                                  className="group/lesson transition-all duration-200 hover:border-cyan-600/30 dark:hover:border-cyan-500/30 hover:bg-cyan-600/5 dark:hover:bg-cyan-500/5"
                                >
                                  <div className="flex items-start gap-2 md:gap-3">
                                    {lessonContent}
                                  </div>
                                </GlassPanel>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Start module button */}
                        <div className="flex justify-center md:justify-end">
                          {isDisabled ? (
                            <Button
                              className="bg-gray-400 text-white cursor-not-allowed"
                              disabled
                            >
                              Available Soon <Lock className="w-4 h-4 ml-2" />
                            </Button>
                          ) : (
                            <Link
                              to="/learn/$slug"
                              params={{ slug: moduleSegments[0]?.slug }}
                            >
                              <Button variant="cyan" className="rounded-xl px-6 py-2.5 text-sm font-bold">
                                Start Module <Play className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </GlassPanel>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade with theme accent - matching hero */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent dark:from-[#0b101a] dark:via-[#0b101a]/80"></div>
      <div className="section-divider-glow-bottom"></div>
    </section>
  );
}
