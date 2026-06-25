import { useNewsletterSubscription } from "~/hooks/use-newsletter-subscription";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";

interface NewsletterFormProps {
  showStats?: boolean;
}

export function NewsletterForm({ showStats = true }: NewsletterFormProps) {
  const { email, setEmail, isSubmitted, isLoading, handleSubmit, containerRef } =
    useNewsletterSubscription();
  const { t } = useTranslation();

  return (
    <div ref={containerRef}>
      {isSubmitted ? (
        <div className="relative">
            {/* Success card with glass morphism */}
            <div className="relative bg-white/10 dark:bg-theme-500/10 backdrop-blur-md border border-theme-200/50 dark:border-theme-500/30 rounded-2xl p-8 max-w-md mx-auto shadow-2xl">
              {/* Glow effect behind card */}
              <div className="absolute inset-0 bg-theme-500/10 blur-3xl rounded-full"></div>

              <div className="relative">
                <div className="mb-4">
                  <div className="relative inline-block">
                    <svg
                      className="w-16 h-16 mx-auto text-theme-500 dark:text-theme-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {/* Icon glow */}
                    <div className="absolute inset-0 bg-theme-500/20 blur-xl"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-theme-600 dark:text-theme-400 mb-2">
                  {t("home.newsletterForm.success")}
                </h3>
                <p className="text-muted-foreground">
                  {t("home.newsletterForm.successDesc")}
                </p>
              </div>
            </div>
          </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
            {/* Form glow effect */}
            <div className="absolute inset-0 bg-theme-500/5 blur-3xl"></div>

            <div className="relative flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("home.newsletterForm.placeholder")}
                className="flex-1 px-6 py-3 h-14 text-lg rounded-lg bg-white/80 dark:bg-background/80 backdrop-blur-sm text-foreground border border-theme-200/50 dark:border-border/50 focus:outline-none focus:border-theme-500 focus:ring-2 focus:ring-theme-500/30 transition-all duration-300 hover:border-theme-400/50"
                required
              />
              <Button
                type="submit"
                className="px-8 h-14 text-lg font-medium bg-gradient-to-r from-theme-500 to-theme-600 hover:from-theme-600 hover:to-theme-700 transition-all duration-300 shadow-lg hover:shadow-theme-500/25"
                disabled={isLoading}
              >
                {isLoading ? t("home.newsletterForm.joining") : t("home.newsletterForm.join")}
              </Button>
            </div>
            
            {/* reCAPTCHA disclaimer */}
            <p className="mt-3 text-xs text-muted-foreground text-center">
              {t("home.newsletterForm.recaptchaPrefix")}{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-500 hover:text-theme-600 transition-colors"
              >
                {t("home.newsletterForm.privacyPolicy")}
              </a>
              {t("home.newsletterForm.recaptchaConjunction")}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-500 hover:text-theme-600 transition-colors"
              >
                {t("home.newsletterForm.termsOfService")}
              </a>
              {t("home.newsletterForm.recaptchaClosing")}
            </p>
          </form>
      )}

      {showStats && (
        <div className="mt-16 relative">
            {/* Stats container with glass morphism */}
            <div className="group relative bg-white/5 dark:bg-theme-500/5 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-600 hover:border-theme-400 dark:hover:border-theme-500 rounded-2xl p-6 transition-all duration-500 hover:bg-white/10 dark:hover:bg-theme-500/10 hover:shadow-2xl hover:shadow-theme-500/20">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-theme-500/0 via-theme-500/8 to-theme-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>

              {/* Animated background glyphs */}
              <div className="absolute top-3 left-3 opacity-5 group-hover:opacity-15 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                <svg
                  className="w-8 h-8 text-theme-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <div className="absolute top-3 right-3 opacity-5 group-hover:opacity-15 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12">
                <svg
                  className="w-8 h-8 text-theme-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </svg>
              </div>

              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-5 group-hover:opacity-15 transition-all duration-600 group-hover:scale-110 group-hover:translate-y-1">
                <svg
                  className="w-8 h-8 text-theme-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300 sm:flex-row sm:gap-8">
                <div className="text-center group-hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-theme-500 to-theme-600 dark:from-theme-400 dark:to-theme-500 bg-clip-text text-transparent group-hover:from-theme-400 group-hover:to-theme-500 transition-all duration-300">
                    500+
                  </div>
                  <div className="text-sm sm:text-base group-hover:text-theme-600 dark:group-hover:text-theme-400 transition-colors duration-300">
                    {t("home.newsletterForm.statsWaiting")}
                  </div>
                </div>
                <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent group-hover:via-theme-400 transition-colors duration-300" />
                <div className="block sm:hidden w-12 h-px bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-theme-400 transition-colors duration-300 my-2" />
                <div className="text-center group-hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-theme-500 to-theme-600 dark:from-theme-400 dark:to-theme-500 bg-clip-text text-transparent group-hover:from-theme-400 group-hover:to-theme-500 transition-all duration-300">
                    Q3 2025
                  </div>
                  <div className="text-sm sm:text-base group-hover:text-theme-600 dark:group-hover:text-theme-400 transition-colors duration-300">
                    {t("home.newsletterForm.statsLaunch")}
                  </div>
                </div>
                <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent group-hover:via-theme-400 transition-colors duration-300" />
                <div className="block sm:hidden w-12 h-px bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-theme-400 transition-colors duration-300 my-2" />
                <div className="text-center group-hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-theme-500 to-theme-600 dark:from-theme-400 dark:to-theme-500 bg-clip-text text-transparent group-hover:from-theme-400 group-hover:to-theme-500 transition-all duration-300">
                    100%
                  </div>
                  <div className="text-sm sm:text-base group-hover:text-theme-600 dark:group-hover:text-theme-400 transition-colors duration-300">
                    {t("home.newsletterForm.statsWorth")}
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}
