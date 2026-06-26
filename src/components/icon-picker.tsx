import { useState, useMemo } from "react";
import { cn } from "~/lib/utils";
import { Input } from "~/components/ui/input";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Code,
  Code2,
  Rocket,
  Lightbulb,
  GraduationCap,
  FileText,
  Video,
  PlayCircle,
  Puzzle,
  Wrench,
  Settings,
  Database,
  Server,
  Globe,
  Layout,
  Layers,
  Box,
  Package,
  Cpu,
  Terminal,
  GitBranch,
  Github,
  Folder,
  FolderOpen,
  File,
  FileCode,
  FileJson,
  Braces,
  Hash,
  Variable,
  SquareFunction,
  Brackets,
  Bug,
  TestTube,
  FlaskConical,
  Beaker,
  Microscope,
  Target,
  Trophy,
  Medal,
  Award,
  Star,
  Heart,
  Flame,
  Zap,
  Sparkles,
  Wand2,
  Shield,
  Lock,
  Key,
  Fingerprint,
  Eye,
  EyeOff,
  Search,
  Filter,
  SortAsc,
  List,
  ListOrdered,
  CheckSquare,
  Clock,
  Timer,
  Calendar,
  MessageSquare,
  MessageCircle,
  Mail,
  Send,
  Share2,
  Link,
  ExternalLink,
  Download,
  Upload,
  Cloud,
  CloudUpload,
  CloudDownload,
  Wifi,
  Signal,
  Radio,
  Smartphone,
  Monitor,
  Laptop,
  Tablet,
  Mouse,
  Keyboard,
  Gamepad2,
  Music,
  Image,
  Camera,
  Palette,
  Brush,
  Pencil,
  PenTool,
  Edit,
  Edit3,
  Scissors,
  Copy,
  Clipboard,
  Save,
  RefreshCw,
  RotateCw,
  Repeat,
  Shuffle,
  Play,
  Pause,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Pentagon,
  Compass,
  Map,
  MapPin,
  Navigation,
  Home,
  Building,
  Building2,
  Store,
  ShoppingCart,
  CreditCard,
  Wallet,
  DollarSign,
  Euro,
  Bitcoin,
  TrendingUp,
  TrendingDown,
  BarChart,
  BarChart2,
  PieChart,
  LineChart,
  Activity,
  Gauge,
  Users,
  User,
  UserPlus,
  UserMinus,
  UserCheck,
  Handshake,
  HeartHandshake,
  Brain,
  Bot,
  Workflow,
  Network,
  Binary,
  Blocks,
  Boxes,
  Component,
  Aperture,
  type LucideIcon,
} from "lucide-react";

// Map of icon names to icon components
export const AVAILABLE_ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Code,
  Code2,
  Rocket,
  Lightbulb,
  GraduationCap,
  FileText,
  Video,
  PlayCircle,
  Puzzle,
  Wrench,
  Settings,
  Database,
  Server,
  Globe,
  Layout,
  Layers,
  Box,
  Package,
  Cpu,
  Terminal,
  GitBranch,
  Github,
  Folder,
  FolderOpen,
  File,
  FileCode,
  FileJson,
  Braces,
  Hash,
  Variable,
  SquareFunction,
  Brackets,
  Bug,
  TestTube,
  FlaskConical,
  Beaker,
  Microscope,
  Target,
  Trophy,
  Medal,
  Award,
  Star,
  Heart,
  Flame,
  Zap,
  Sparkles,
  Wand2,
  Shield,
  Lock,
  Key,
  Fingerprint,
  Eye,
  EyeOff,
  Search,
  Filter,
  SortAsc,
  List,
  ListOrdered,
  CheckSquare,
  Clock,
  Timer,
  Calendar,
  MessageSquare,
  MessageCircle,
  Mail,
  Send,
  Share2,
  Link,
  ExternalLink,
  Download,
  Upload,
  Cloud,
  CloudUpload,
  CloudDownload,
  Wifi,
  Signal,
  Radio,
  Smartphone,
  Monitor,
  Laptop,
  Tablet,
  Mouse,
  Keyboard,
  Gamepad2,
  Music,
  Image,
  Camera,
  Palette,
  Brush,
  Pencil,
  PenTool,
  Edit,
  Edit3,
  Scissors,
  Copy,
  Clipboard,
  Save,
  RefreshCw,
  RotateCw,
  Repeat,
  Shuffle,
  Play,
  Pause,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Pentagon,
  Compass,
  Map,
  MapPin,
  Navigation,
  Home,
  Building,
  Building2,
  Store,
  ShoppingCart,
  CreditCard,
  Wallet,
  DollarSign,
  Euro,
  Bitcoin,
  TrendingUp,
  TrendingDown,
  BarChart,
  BarChart2,
  PieChart,
  LineChart,
  Activity,
  Gauge,
  Users,
  User,
  UserPlus,
  UserMinus,
  UserCheck,
  Handshake,
  HeartHandshake,
  Brain,
  Bot,
  Workflow,
  Network,
  Binary,
  Blocks,
  Boxes,
  Component,
  Aperture,
};

// Helper function to render an icon by name
export function renderIcon(iconName: string | null | undefined, props?: { className?: string }) {
  if (!iconName || !AVAILABLE_ICONS[iconName]) {
    return <BookOpen {...props} />;
  }
  const IconComponent = AVAILABLE_ICONS[iconName];
  return <IconComponent {...props} />;
}

interface IconPickerProps {
  value: string | null;
  onChange: (iconName: string | null) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const filteredIcons = useMemo(() => {
    const query = search.toLowerCase();
    return Object.entries(AVAILABLE_ICONS).filter(([name]) =>
      name.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className={cn("space-y-3", className)}>
      <Input
        placeholder={t("common.iconPicker.searchPlaceholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9"
      />
      <div className="h-[280px] overflow-y-auto rounded-md border border-border bg-muted/30 p-2">
        <div className="grid grid-cols-8 gap-1">
          {filteredIcons.map(([name, Icon]) => (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name === value ? null : name)}
              className={cn(
                "flex items-center justify-center p-2 rounded-md transition-all hover:bg-accent",
                value === name
                  ? "bg-theme-500/20 text-theme-600 dark:text-theme-400 ring-2 ring-theme-500/50"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={name}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        {filteredIcons.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            {t("common.iconPicker.noIconsFound")}
          </div>
        )}
      </div>
      {value && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{t("common.iconPicker.selected")}</span>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted">
            {renderIcon(value, { className: "h-4 w-4" })}
            <span className="font-mono text-xs">{value}</span>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-destructive hover:underline"
          >
            {t("common.iconPicker.clear")}
          </button>
        </div>
      )}
    </div>
  );
}
