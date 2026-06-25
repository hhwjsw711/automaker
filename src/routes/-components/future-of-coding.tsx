import { useTranslation } from "react-i18next";
import { Zap, Brain, Rocket } from "lucide-react";

export function FutureOfCodingSection() {
  const { t } = useTranslation();
  return (
    <section className="relative w-full py-12 md:py-24">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-theme-50/50 dark:bg-background/20 backdrop-blur-sm border border-theme-200 dark:border-border/50 text-theme-600 dark:text-theme-400 text-xs md:text-sm font-medium mb-6 md:mb-8">
            <span className="w-2 h-2 bg-theme-500 dark:bg-theme-400 rounded-full mr-2"></span>
            {t("home.future.badge")}
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-6xl leading-tight mb-6 md:mb-8">
            {t("home.future.headingLine1")}{" "}
            <span className="text-theme-400">{t("home.future.headingLine2")}</span>
            {t("home.future.headingLine3")}{" "}
            <span className="text-theme-400">{t("home.future.headingLine4")}</span>{" "}
          </h2>

          <p className="text-description mb-8 md:mb-12 max-w-4xl mx-auto text-sm md:text-base lg:text-lg">
            {t("home.future.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-16 items-stretch">
          <FeatureCard
            icon={
              <Zap className="w-8 h-8 text-theme-500 group-hover:text-theme-400 group-hover:scale-110 transition-all duration-300" />
            }
            title={t("home.future.feature1_title")}
            description={t("home.future.feature1_desc")}
            glyphPath="M13 2.05v2.02c4.39.54 7.5 4.53 6.96 8.92-.39 3.18-2.34 5.13-5.52 5.52-4.39.54-8.38-2.57-8.92-6.96S7.1 3.05 11.49 2.51c.17-.02.34-.03.51-.03V2.05c-5.04.5-9 4.76-8.5 9.8.5 5.04 4.76 9 9.8 8.5s9-4.76 8.5-9.8c-.39-3.93-3.57-7.11-7.5-7.5z"
            glyphExtra={null}
          />

          <FeatureCard
            icon={
              <Brain className="w-8 h-8 text-theme-500 group-hover:text-theme-400 group-hover:scale-110 transition-all duration-300" />
            }
            title={t("home.future.feature2_title")}
            description={t("home.future.feature2_desc")}
            glyphPath="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            glyphExtra={null}
          />

          <FeatureCard
            icon={
              <Rocket className="w-8 h-8 text-theme-500 group-hover:text-theme-400 group-hover:scale-110 transition-all duration-300" />
            }
            title={t("home.future.feature3_title")}
            description={t("home.future.feature3_desc")}
            glyphPath="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            glyphExtra={null}
          />
        </div>

        <div className="text-center">
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("home.future.closing")}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      <div className="section-divider-glow-bottom"></div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  glyphPath: string;
  glyphExtra?: React.ReactNode;
}

function FeatureCard({
  icon,
  title,
  description,
  glyphPath,
  glyphExtra,
}: FeatureCardProps) {
  return (
    <div className="group relative h-full bg-white/10 dark:bg-theme-500/10 backdrop-blur-md border-2 border-gray-300 dark:border-gray-600 rounded-2xl p-8 hover:border-theme-400 dark:hover:border-theme-500 transition-all duration-500 hover:bg-white/15 dark:hover:bg-theme-500/15 hover:shadow-2xl hover:shadow-theme-500/20">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-theme-500/0 via-theme-500/10 to-theme-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

      {/* Animated background glyph */}
      <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
        <svg
          className="w-16 h-16 text-theme-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d={glyphPath} />
          {glyphExtra}
        </svg>
      </div>

      <div className="relative z-10">
        <div className="w-16 h-16 rounded-full bg-theme-500/20 flex items-center justify-center mb-6 group-hover:bg-theme-500/30 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-4 group-hover:text-theme-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
  );
}
