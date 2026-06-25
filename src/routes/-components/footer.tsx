import { Link } from "@tanstack/react-router";
import { DISCORD_INVITE_LINK } from "~/config";
import { useFirstSegment } from "~/hooks/use-first-segment";
import { useTranslation } from "react-i18next";

export function FooterSection() {
  const { t } = useTranslation();
  const firstSegment = useFirstSegment();

  return (
    <footer className="relative py-12 px-6 bg-muted/50 dark:bg-background">
      <div className="section-divider-glow-top"></div>
      <div className="max-w-4xl mx-auto text-muted-foreground">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer.learn")}</h3>
            <ul className="space-y-2">
              <li>
                {firstSegment.data && (
                  <Link
                    to="/learn/$slug"
                    params={{ slug: firstSegment.data.slug }}
                    className="hover:text-foreground transition-colors"
                  >
                    {t("footer.getStarted")}
                  </Link>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer.purchase")}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/purchase"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footer.buyNow")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer.legal")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms-of-service"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footer.termsOfService")}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footer.refundPolicy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:hhwjsw711@gmail.com"
                  className="hover:text-foreground transition-colors break-all"
                  style={{ wordBreak: "break-all" }}
                >
                  hhwjsw711@gmail.com
                </a>
              </li>
              <li>
                <a
                  href={DISCORD_INVITE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footer.discord")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-border">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
