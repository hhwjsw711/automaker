import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ScrollAnimation, ScrollScale } from "~/components/scroll-animation";
import { Button } from "~/components/ui/button";
import {
  MessageCircle,
  Users,
  Zap,
  Heart,
  Code,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { DISCORD_INVITE_LINK } from "~/config";

export const Route = createFileRoute("/community")({
  component: CommunityPage,
});

function CommunityPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full py-24 pt-32">
        <div className="absolute inset-0 hero-background-ai"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-theme-500/5 dark:via-theme-950/20 to-transparent"></div>

        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="circuit-pattern absolute inset-0"></div>
        </div>

        <div className="floating-elements">
          <div className="floating-element-1"></div>
          <div className="floating-element-2"></div>
          <div className="floating-element-3"></div>
          <div className="floating-element-small top-10 right-10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <ScrollAnimation direction="down" delay={0}>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-theme-50/50 dark:bg-background/20 backdrop-blur-sm border border-theme-200 dark:border-border/50 text-theme-600 dark:text-theme-400 text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-theme-500 dark:bg-theme-400 rounded-full mr-2 animate-pulse"></span>
                {t("community.badge")}
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.1}>
              <h1 className="text-6xl leading-tight mb-8">
                {t("community.headingLine1")}{" "}
                <span className="text-theme-400">{t("community.headingLine2a")}</span>
                <br />
                <span className="text-theme-400">{t("community.headingLine2b")}</span>
              </h1>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.2}>
              <p className="text-description mb-12 max-w-4xl mx-auto text-lg">
                {t("community.description")}
              </p>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.3}>
              <a
                href={DISCORD_INVITE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button size="lg" className="text-lg px-8 py-4 h-auto group">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {t("community.joinButton")}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </ScrollAnimation>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="section-divider-glow-bottom"></div>
      </section>

      {/* Community Features */}
      <section className="relative w-full py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-theme-500/5 dark:via-theme-950/10 to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <ScrollAnimation direction="up" delay={0}>
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-theme-400">{t("community.whyJoin")}</span>
              </h2>
              <p className="text-description text-lg max-w-3xl mx-auto">
                {t("community.whyJoinDesc")}
              </p>
            </ScrollAnimation>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <ScrollScale delay={0.1}>
              <CommunityFeatureCard
                icon={
                  <Users className="w-8 h-8 text-theme-500 group-hover:text-theme-400 group-hover:scale-110 transition-all duration-300" />
                }
                title={t("community.expertNetwork")}
                description={t("community.expertNetworkDesc")}
              />
            </ScrollScale>

            <ScrollScale delay={0.2}>
              <CommunityFeatureCard
                icon={
                  <Code className="w-8 h-8 text-theme-500 group-hover:text-theme-400 group-hover:scale-110 transition-all duration-300" />
                }
                title={t("community.codeReviews")}
                description={t("community.codeReviewsDesc")}
              />
            </ScrollScale>

            <ScrollScale delay={0.3}>
              <CommunityFeatureCard
                icon={
                  <Lightbulb className="w-8 h-8 text-theme-500 group-hover:text-theme-400 group-hover:scale-110 transition-all duration-300" />
                }
                title={t("community.latestInsights")}
                description={t("community.latestInsightsDesc")}
              />
            </ScrollScale>

            <ScrollScale delay={0.4}>
              <CommunityFeatureCard
                icon={
                  <Zap className="w-8 h-8 text-theme-500 group-hover:text-theme-400 group-hover:scale-110 transition-all duration-300" />
                }
                title={t("community.quickHelp")}
                description={t("community.quickHelpDesc")}
              />
            </ScrollScale>

            <ScrollScale delay={0.5}>
              <CommunityFeatureCard
                icon={
                  <Heart className="w-8 h-8 text-theme-500 group-hover:text-theme-400 group-hover:scale-110 transition-all duration-300" />
                }
                title={t("community.supportiveEnvironment")}
                description={t("community.supportiveDesc")}
              />
            </ScrollScale>

            <ScrollScale delay={0.6}>
              <CommunityFeatureCard
                icon={
                  <MessageCircle className="w-8 h-8 text-theme-500 group-hover:text-theme-400 group-hover:scale-110 transition-all duration-300" />
                }
                title={t("community.activeDiscussions")}
                description={t("community.activeDiscussionsDesc")}
              />
            </ScrollScale>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative w-full py-24">
        <div className="absolute inset-0 hero-background-ai"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-theme-500/10 dark:via-theme-950/20 to-transparent"></div>

        <div className="floating-elements">
          <div className="floating-element-1"></div>
          <div className="floating-element-2"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <ScrollAnimation direction="up" delay={0}>
            <h2 className="text-5xl font-bold mb-8">
              <span className="text-theme-400">{t("community.ctaHeading")}</span>
            </h2>
            <p className="text-description text-xl mb-12 max-w-3xl mx-auto">
              {t("community.ctaDesc")}
            </p>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={DISCORD_INVITE_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="text-lg px-8 py-4 h-auto group">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {t("community.joinNow")}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <p className="text-sm text-muted-foreground">
                {t("community.freeOffer")}
              </p>
            </div>
          </ScrollAnimation>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      </section>
    </div>
  );
}

interface CommunityFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function CommunityFeatureCard({
  icon,
  title,
  description,
}: CommunityFeatureCardProps) {
  return (
    <div className="group relative h-full bg-white/10 dark:bg-theme-500/10 backdrop-blur-md border-2 border-gray-300 dark:border-gray-600 rounded-2xl p-8 hover:border-theme-400 dark:hover:border-theme-500 transition-all duration-500 hover:bg-white/15 dark:hover:bg-theme-500/15 hover:shadow-2xl hover:shadow-theme-500/20">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-theme-500/0 via-theme-500/10 to-theme-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

      <div className="relative z-10">
        <div className="w-16 h-16 rounded-full bg-theme-500/20 flex items-center justify-center mb-6 group-hover:bg-theme-500/30 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-4 group-hover:text-theme-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
  );
}
