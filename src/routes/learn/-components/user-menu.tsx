import { Home, LogOut, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "~/hooks/use-auth";
import { useProfile } from "~/hooks/use-profile";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const user = useAuth();
  const { data: profile } = useProfile();
  const { t } = useTranslation();

  if (!user) {
    return (
      <div className={cn("p-4 border-t border-slate-200/60 dark:border-white/5 space-y-1 mt-auto bg-slate-50/50 dark:bg-black/10", className)}>
        <a
          href="/api/login/google"
          className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
        >
          <User className="w-4 h-4" />
          {t("learn.login")}
        </a>
      </div>
    );
  }

  return (
    <div className={cn("p-4 border-t border-slate-200/60 dark:border-white/5 space-y-1 mt-auto bg-slate-50/50 dark:bg-black/10", className)}>
      <Link
        to="/"
        className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
      >
        <Home className="w-4 h-4" />
        {t("learn.userBackToHome")}
      </Link>
      <a
        href="/api/logout"
        className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
      >
        <LogOut className="w-4 h-4" />
        {t("learn.logout")}
      </a>
    </div>
  );
}
