import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/privacy-policy")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-16">
      <article className="prose prose-slate">
        <h1>{t("privacy_policy.heading")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("privacy_policy.lastUpdated")}
        </p>

        <p>{t("privacy_policy.intro1")}</p>
        <p>{t("privacy_policy.intro2")}</p>

        <h2>{t("privacy_policy.interpretationHeading")}</h2>
        <h3>{t("privacy_policy.def_interpretation")}</h3>
        <p>{t("privacy_policy.interpretation")}</p>

        <h3>{t("privacy_policy.definitionsHeading")}</h3>
        <p>{t("privacy_policy.definitionsIntro")}</p>
        <ul>
          <li>
            <strong>Account</strong> {t("privacy_policy.def_account")}
          </li>
          <li>
            <strong>Affiliate</strong> {t("privacy_policy.def_affiliate")}
          </li>
          <li>
            <strong>Company</strong> {t("privacy_policy.def_company")}
          </li>
          <li>
            <strong>Cookies</strong> {t("privacy_policy.def_cookies")}
          </li>
          <li>
            <strong>Country</strong> {t("privacy_policy.def_country")}
          </li>
          <li>
            <strong>Device</strong> {t("privacy_policy.def_device")}
          </li>
          <li>
            <strong>Personal Data</strong> {t("privacy_policy.def_personalData")}
          </li>
          <li>
            <strong>Service</strong> {t("privacy_policy.def_service")}
          </li>
          <li>
            <strong>Service Provider</strong> {t("privacy_policy.def_serviceProvider")}
          </li>
          <li>
            <strong>Third-party Social Media Service</strong> {t("privacy_policy.def_thirdParty")}
          </li>
          <li>
            <strong>Usage Data</strong> {t("privacy_policy.def_usageData")}
          </li>
          <li>
            <strong>Website</strong> {t("privacy_policy.def_website")}
          </li>
          <li>
            <strong>You</strong> {t("privacy_policy.def_you")}
          </li>
        </ul>

        <h2>{t("privacy_policy.collectingHeading")}</h2>
        <h3>{t("privacy_policy.typesDataHeading")}</h3>
        <h4>{t("privacy_policy.personalDataHeading")}</h4>
        <p>{t("privacy_policy.personalData")}</p>
        <ul>
          <li>{t("privacy_policy.personalData_email")}</li>
          <li>{t("privacy_policy.personalData_name")}</li>
          <li>{t("privacy_policy.personalData_usage")}</li>
        </ul>

        <h4>{t("privacy_policy.usageDataHeading")}</h4>
        <p>{t("privacy_policy.usageData1")}</p>
        <p>{t("privacy_policy.usageData2")}</p>

        <h4>{t("privacy_policy.thirdPartyHeading")}</h4>
        <p>{t("privacy_policy.thirdParty")}</p>
        <ul>
          <li>{t("privacy_policy.thirdParty_google")}</li>
          <li>{t("privacy_policy.thirdParty_facebook")}</li>
          <li>{t("privacy_policy.thirdParty_twitter")}</li>
          <li>{t("privacy_policy.thirdParty_linkedin")}</li>
        </ul>

        <h2>{t("privacy_policy.trackingHeading")}</h2>
        <p>{t("privacy_policy.tracking")}</p>

        <h2>{t("privacy_policy.useHeading")}</h2>
        <p>{t("privacy_policy.useIntro")}</p>
        <ul>
          <li>{t("privacy_policy.use_1")}</li>
          <li>{t("privacy_policy.use_2")}</li>
          <li>{t("privacy_policy.use_3")}</li>
          <li>{t("privacy_policy.use_4")}</li>
          <li>{t("privacy_policy.use_5")}</li>
          <li>{t("privacy_policy.use_6")}</li>
          <li>{t("privacy_policy.use_7")}</li>
          <li>{t("privacy_policy.use_8")}</li>
        </ul>

        <h2>{t("privacy_policy.retentionHeading")}</h2>
        <p>{t("privacy_policy.retention")}</p>

        <h2>{t("privacy_policy.transferHeading")}</h2>
        <p>{t("privacy_policy.transfer")}</p>

        <h2>{t("privacy_policy.deleteHeading")}</h2>
        <p>{t("privacy_policy.delete")}</p>

        <h2>{t("privacy_policy.disclosureHeading")}</h2>
        <h3>{t("privacy_policy.businessTransactionsHeading")}</h3>
        <p>{t("privacy_policy.businessTransactions")}</p>

        <h3>{t("privacy_policy.lawEnforcementHeading")}</h3>
        <p>{t("privacy_policy.lawEnforcement")}</p>

        <h2>{t("privacy_policy.securityHeading")}</h2>
        <p>{t("privacy_policy.security")}</p>

        <h2>{t("privacy_policy.childrenHeading")}</h2>
        <p>{t("privacy_policy.children")}</p>

        <h2>{t("privacy_policy.linksHeading")}</h2>
        <p>{t("privacy_policy.links")}</p>

        <h2>{t("privacy_policy.changesHeading")}</h2>
        <p>{t("privacy_policy.changes")}</p>

        <h2>{t("privacy_policy.contactHeading")}</h2>
        <p>{t("privacy_policy.contact")}</p>
        <p>
          {t("privacy_policy.contactEmail")}{" "}
          <a href="mailto:hhwjsw711@gmail.com">hhwjsw711@gmail.com</a>
        </p>
      </article>
    </div>
  );
}
