import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/terms-of-service")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-16">
      <article className="prose prose-slate">
        <h1>{t("terms_of_service.heading")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("terms_of_service.lastUpdated")}
        </p>

        <p>{t("terms_of_service.intro")}</p>

        <h2>{t("terms_of_service.interpretationHeading")}</h2>
        <h3>{t("terms_of_service.def_interpretation")}</h3>
        <p>{t("terms_of_service.interpretation")}</p>

        <h3>{t("terms_of_service.definitionsHeading")}</h3>
        <p>{t("terms_of_service.definitionsIntro")}</p>

        <ul>
          <li>
            <strong>Affiliate</strong> {t("terms_of_service.def_affiliate")}
          </li>
          <li>
            <strong>Country</strong> {t("terms_of_service.def_country")}
          </li>
          <li>
            <strong>Company</strong> {t("terms_of_service.def_company")}
          </li>
          <li>
            <strong>Device</strong> {t("terms_of_service.def_device")}
          </li>
          <li>
            <strong>Service</strong> {t("terms_of_service.def_service")}
          </li>
          <li>
            <strong>Terms and Conditions</strong> {t("terms_of_service.def_terms")}
          </li>
          <li>
            <strong>Third-party Social Media Service</strong> {t("terms_of_service.def_thirdParty")}
          </li>
          <li>
            <strong>Website</strong> {t("terms_of_service.def_website")}
          </li>
          <li>
            <strong>You</strong> {t("terms_of_service.def_you")}
          </li>
        </ul>

        <h2>{t("terms_of_service.acknowledgmentHeading")}</h2>
        <p>{t("terms_of_service.ack1")}</p>
        <p>{t("terms_of_service.ack2")}</p>
        <p>{t("terms_of_service.ack3")}</p>
        <p>{t("terms_of_service.ack4")}</p>

        <h2>{t("terms_of_service.linksHeading")}</h2>
        <p>{t("terms_of_service.links1")}</p>
        <p>{t("terms_of_service.links2")}</p>
        <p>{t("terms_of_service.links3")}</p>

        <h2>{t("terms_of_service.terminationHeading")}</h2>
        <p>{t("terms_of_service.term1")}</p>
        <p>{t("terms_of_service.term2")}</p>

        <h2>{t("terms_of_service.liabilityHeading")}</h2>
        <p>{t("terms_of_service.liability1")}</p>
        <p>{t("terms_of_service.liability2")}</p>
        <p>{t("terms_of_service.liability3")}</p>

        <h2>{t("terms_of_service.refundHeading")}</h2>
        <p>{t("terms_of_service.refund")}</p>

        <h2>{t("terms_of_service.disclaimerHeading")}</h2>
        <p>{t("terms_of_service.disclaimer")}</p>

        <h2>{t("terms_of_service.governingLawHeading")}</h2>
        <p>{t("terms_of_service.governingLaw")}</p>

        <h2>{t("terms_of_service.disputesHeading")}</h2>
        <p>{t("terms_of_service.disputes")}</p>

        <h2>{t("terms_of_service.euHeading")}</h2>
        <p>{t("terms_of_service.eu")}</p>

        <h2>{t("terms_of_service.usLegalHeading")}</h2>
        <p>{t("terms_of_service.usLegal")}</p>

        <h2>{t("terms_of_service.severabilityHeading")}</h2>
        <h3>{t("terms_of_service.def_severability")}</h3>
        <p>{t("terms_of_service.severability")}</p>

        <h3>{t("terms_of_service.def_waiver")}</h3>
        <p>{t("terms_of_service.waiver")}</p>

        <h2>{t("terms_of_service.translationHeading")}</h2>
        <p>{t("terms_of_service.translation")}</p>

        <h2>{t("terms_of_service.changesHeading")}</h2>
        <p>{t("terms_of_service.changes1")}</p>
        <p>{t("terms_of_service.changes2")}</p>

        <h2>{t("terms_of_service.contactHeading")}</h2>
        <p>{t("terms_of_service.contact1")}</p>
        <p>{t("terms_of_service.contact2")}</p>
      </article>
    </div>
  );
}
