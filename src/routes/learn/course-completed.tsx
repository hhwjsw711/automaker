import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useWindowSize } from "~/hooks/use-window-size";
import Confetti from "react-confetti";
import { Twitter, Github, MessageCircle } from "lucide-react";
import { useNewsletterSubscription } from "~/hooks/use-newsletter-subscription";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/learn/course-completed")({
  component: CourseCompleted,
});

function CourseCompleted() {
  const [confettiPieces, setConfettiPieces] = useState(100);
  const { width, height } = useWindowSize();
  const { email, setEmail, isSubmitted, isLoading, handleSubmit } =
    useNewsletterSubscription();
  const { t } = useTranslation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setConfettiPieces(0);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const handleNewsletterSuccess = () => {
    toast.success(t("learn.thankYou"), { description: t("learn.thankYouDesc") });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient similar to homepage */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(var(--color-theme-500-rgb)/0.05)_0%,transparent_65%)] pointer-events-none" />

      <Confetti width={width} height={height} numberOfPieces={confettiPieces} />

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        <div className="text-center space-y-6">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-theme-400 drop-shadow-[0_0_10px_rgb(var(--color-theme-500-rgb)/0.3)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground">
            {t("learn.courseCompleted")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("learn.courseCompletedDesc")}
          </p>
        </div>

        <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-theme-400/20 shadow-[0_0_15px_rgb(var(--color-theme-500-rgb)/0.1)] p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">{t("learn.getInTouch")}</h2>
          <p className="text-muted-foreground">
            {t("learn.getInTouchDesc")}{" "}
            <a
              href="mailto:hhwjsw711@gmail.com"
              className="text-theme-400 hover:text-theme-300 transition-colors"
            >
              hhwjsw711@gmail.com
            </a>
          </p>
        </div>

        <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-theme-400/20 shadow-[0_0_15px_rgb(var(--color-theme-500-rgb)/0.1)] p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">{t("learn.stayUpdated")}</h2>
          <p className="text-muted-foreground">
            {t("learn.stayUpdatedDesc")}
          </p>

          {isSubmitted ? (
            <div className="max-w-xl mx-auto">
              <div className="bg-theme-500/10 border border-theme-500/20 rounded-lg p-6">
                <h3 className="text-2xl font-semibold text-theme-400 mb-2">
                  {t("learn.thankYou")}
                </h3>
                <p className="text-muted-foreground/70">
                  {t("learn.thankYouDesc")}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  {t("learn.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("learn.enterEmail")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 border-theme-400/20 focus:border-theme-400 text-foreground"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-theme-400 hover:bg-theme-500 text-primary-foreground font-semibold"
                disabled={isLoading}
              >
                {isLoading ? t("learn.subscribing") : t("learn.subscribeToNewsletter")}
              </Button>
            </form>
          )}
        </div>

        <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-theme-400/20 shadow-[0_0_15px_rgb(var(--color-theme-500-rgb)/0.1)] p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">{t("learn.connectWithMe")}</h2>
          <div className="flex gap-4 justify-center">
            <Button
              variant="glass"
              asChild
            >
              <a
                href="https://twitter.com/hhwjsw711"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="mr-2 h-4 w-4" />
                {t("learn.twitter")}
              </a>
            </Button>
            <Button
              variant="glass"
              asChild
            >
              <a
                href="https://github.com/hhwjsw711"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                {t("learn.github")}
              </a>
            </Button>
            <Button
              variant="glass"
              asChild
            >
              <a
                href="https://discord.gg/ffVjn26Cfd"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {t("learn.discord")}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
