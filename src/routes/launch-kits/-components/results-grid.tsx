import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Zap } from "lucide-react";
import { LaunchKitCard } from "./launch-kit-card";
import { useTranslation } from "react-i18next";

interface ResultsGridProps {
  isLoading: boolean;
  filteredLaunchKits: any[] | undefined;
  hasActiveFilters: boolean;
  onClone: (kit: any) => void;
  onClearFilters: () => void;
}

export function ResultsGrid({
  isLoading,
  filteredLaunchKits,
  hasActiveFilters,
  onClone,
  onClearFilters,
}: ResultsGridProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 min-w-0">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          {isLoading
            ? t("launchKits.loading")
            : t("launchKits.resultsCount", { count: filteredLaunchKits?.length || 0 })}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredLaunchKits?.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t("launchKits.noResults")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters
                  ? t("launchKits.noResultsFiltered")
                  : t("launchKits.noResultsEmpty")}
              </p>
              {hasActiveFilters && (
                <Button onClick={onClearFilters}>{t("launchKits.clearFilters")}</Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {filteredLaunchKits?.map((kit: any) => (
            <LaunchKitCard
              key={kit.id}
              kit={kit}
              onClone={() => onClone(kit)}
            />
          ))}
        </div>
      )}
    </div>
  );
}