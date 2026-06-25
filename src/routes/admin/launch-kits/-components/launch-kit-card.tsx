import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { AppCard } from "~/components/app-card";
import { ExternalLink, Trash2, GitFork, Eye, Edit } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface LaunchKitTag {
  id: number;
  name: string;
  slug: string;
  color: string;
  categoryId: number | null;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

interface LaunchKit {
  id: number;
  name: string;
  description: string;
  repositoryUrl: string;
  cloneCount: number;
  slug: string;
  createdAt: Date;
  tags?: LaunchKitTag[];
}

interface LaunchKitCardProps {
  kit: LaunchKit;
  onDelete: (id: number) => void;
}

export function LaunchKitCard({ kit, onDelete }: LaunchKitCardProps) {
  const { t } = useTranslation();
  return (
    <AppCard
      title={kit.name}
      description={kit.description}
      actions={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(kit.repositoryUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link
              to="/admin/launch-kits/edit/$id"
              params={{ id: kit.id.toString() }}
            >
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(kit.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        {kit.tags && kit.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {kit.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                  border: `1px solid ${tag.color}40`,
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            {kit.cloneCount} {t("admin_pages.launchKitsAdmin.clones")}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {kit.slug}
          </span>
          <span>{kit.createdAt.toLocaleDateString()}</span>
        </div>
      </div>
    </AppCard>
  );
}
