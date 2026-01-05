import { lazy, Suspense } from "react";

// Create lazy wrapper components that defer loading until rendered
export const LazyLineChart = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.LineChart }))
);

export const LazyBarChart = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.BarChart }))
);

export const LazyAreaChart = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.AreaChart }))
);

export const LazyResponsiveContainer = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.ResponsiveContainer }))
);

// Re-export non-lazy components that are small and used as children
export {
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Chart loading fallback component
export function ChartLoadingFallback({ height = 320 }: { height?: number }) {
  return (
    <div
      className="flex items-center justify-center bg-muted/20 rounded-lg animate-pulse"
      style={{ height }}
    >
      <div className="text-muted-foreground text-sm">Loading chart...</div>
    </div>
  );
}

// Wrapper component for lazy charts with built-in Suspense
interface LazyChartContainerProps {
  children: React.ReactNode;
  height?: number;
}

export function LazyChartContainer({
  children,
  height = 320,
}: LazyChartContainerProps) {
  return (
    <Suspense fallback={<ChartLoadingFallback height={height} />}>
      {children}
    </Suspense>
  );
}
