import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/refund-policy")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-16">
      <article className="prose prose-slate">
        <h1>{t("refund_policy.heading")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("refund_policy.lastUpdated")}
        </p>

        <h2>{t("refund_policy.noRefund.heading")}</h2>
        <p>{t("refund_policy.noRefund.p1")}</p>

        <h2>{t("refund_policy.whyNo.heading")}</h2>
        <p>{t("refund_policy.whyNo.p1")}</p>

        <h3>{t("refund_policy.whyNo.abuseHeading")}</h3>
        <p>{t("refund_policy.whyNo.abuseIntro")}</p>

        <ul>
          <li>
            <strong>{t("refund_policy.whyNo.abuse1Title")}</strong>{" "}
            {t("refund_policy.whyNo.abuse1")}
          </li>
          <li>
            <strong>{t("refund_policy.whyNo.abuse2Title")}</strong>{" "}
            {t("refund_policy.whyNo.abuse2")}
          </li>
          <li>
            <strong>{t("refund_policy.whyNo.abuse3Title")}</strong>{" "}
            {t("refund_policy.whyNo.abuse3")}
          </li>
          <li>
            <strong>{t("refund_policy.whyNo.abuse4Title")}</strong>{" "}
            {t("refund_policy.whyNo.abuse4")}
          </li>
        </ul>

        <h3>{t("refund_policy.whyNo.impactHeading")}</h3>
        <p>{t("refund_policy.whyNo.impactIntro")}</p>

        <ul>
          <li>{t("refund_policy.whyNo.impact1")}</li>
          <li>{t("refund_policy.whyNo.impact2")}</li>
          <li>{t("refund_policy.whyNo.impact3")}</li>
          <li>{t("refund_policy.whyNo.impact4")}</li>
        </ul>

        <h2>{t("refund_policy.whatWeOffer.heading")}</h2>
        <p>{t("refund_policy.whatWeOffer.p1")}</p>

        <ul>
          <li>
            <strong>{t("refund_policy.whatWeOffer.offer1Title")}</strong>{" "}
            {t("refund_policy.whatWeOffer.offer1")}
          </li>
          <li>
            <strong>{t("refund_policy.whatWeOffer.offer2Title")}</strong>{" "}
            {t("refund_policy.whatWeOffer.offer2")}
          </li>
          <li>
            <strong>{t("refund_policy.whatWeOffer.offer3Title")}</strong>{" "}
            {t("refund_policy.whatWeOffer.offer3")}
          </li>
          <li>
            <strong>{t("refund_policy.whatWeOffer.offer4Title")}</strong>{" "}
            {t("refund_policy.whatWeOffer.offer4")}
          </li>
        </ul>

        <h2>{t("refund_policy.informedDecision.heading")}</h2>
        <p>{t("refund_policy.informedDecision.p1")}</p>

        <h2>{t("refund_policy.contact.heading")}</h2>
        <p>{t("refund_policy.contact.p1")}</p>
        <p>
          {t("refund_policy.contact.p2")}{" "}
          <a href="mailto:hhwjsw711@gmail.com">hhwjsw711@gmail.com</a>
        </p>
      </article>
    </div>
  );
}
