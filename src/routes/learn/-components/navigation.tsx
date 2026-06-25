import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Segment } from "~/db/schema";
import { useTranslation } from "react-i18next";

interface NavigationProps {
  prevSegment: Segment | null;
  nextSegment: Segment | null;
}

export function Navigation({ prevSegment, nextSegment }: NavigationProps) {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between gap-4 mt-6">
      {prevSegment ? (
        <Button variant="outline" asChild className="flex-1 max-w-[300px]">
          <a href={`/learn/${prevSegment.id}`} className="truncate">
            <ChevronLeft className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{t("learn.previousLabel")} {prevSegment.title}</span>
          </a>
        </Button>
      ) : (
        <div className="flex-1 max-w-[300px]"></div>
      )}
      {nextSegment && (
        <Button asChild className="flex-1 max-w-[300px]">
          <a href={`/learn/${nextSegment.id}`} className="truncate">
            <span className="truncate">{t("learn.nextLabel")} {nextSegment.title}</span>
            <ChevronRight className="ml-2 h-4 w-4 shrink-0" />
          </a>
        </Button>
      )}
    </div>
  );
}
