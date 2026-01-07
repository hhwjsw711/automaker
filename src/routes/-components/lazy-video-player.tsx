import { useState, lazy, Suspense } from "react";
import { Play, Loader2 } from "lucide-react";

// Dynamically import VideoPlayer to keep it out of the main bundle
const VideoPlayer = lazy(() =>
  import("~/routes/learn/-components/video-player").then((module) => ({
    default: module.VideoPlayer,
  }))
);

interface LazyVideoPlayerProps {
  segmentId: number;
  videoKey: string;
  thumbnailUrl?: string | null;
  onAutoComplete?: () => void;
  skipThumbnail?: boolean; // Set to true when thumbnail is already rendered server-side
}

export function LazyVideoPlayer({
  segmentId,
  videoKey,
  thumbnailUrl,
  onAutoComplete,
  skipThumbnail = false,
}: LazyVideoPlayerProps) {
  const [isActivated, setIsActivated] = useState(false);

  // Once activated, render the actual video player
  if (isActivated) {
    return (
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-slate-900">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
          </div>
        }
      >
        <VideoPlayer
          segmentId={segmentId}
          videoKey={videoKey}
          initialThumbnailUrl={thumbnailUrl ?? null}
          onAutoComplete={onAutoComplete}
          autoPlay
        />
      </Suspense>
    );
  }

  // Show thumbnail with play button overlay
  return (
    <div className="w-full h-full relative">
      {!skipThumbnail && thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt="Video thumbnail"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
      ) : !skipThumbnail ? (
        <div className="absolute inset-0 bg-linear-to-br from-slate-800 to-slate-900" />
      ) : null}

      {/* Play button overlay */}
      <button
        onClick={() => setIsActivated(true)}
        className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group/play cursor-pointer"
        aria-label="Play video"
      >
        <div className="relative">
          <div className="p-6 rounded-full bg-white/90 dark:bg-white/80 backdrop-blur-sm group-hover/play:scale-110 transition-transform shadow-lg">
            <Play
              className="h-12 w-12 text-slate-900 ml-1"
              fill="currentColor"
            />
          </div>
        </div>
      </button>
    </div>
  );
}
