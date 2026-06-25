import * as React from "react";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";
import { DotPattern } from "~/components/ui/background-patterns";

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div
        className={cn(
          "w-full flex items-center justify-between p-6 rounded-lg",
          "bg-card/90 dark:bg-card/70 border border-theme-200 dark:border-theme-500/20 backdrop-blur-sm",
          "shadow-[0_0_15px_rgb(var(--color-theme-500-rgb)/0.15)] dark:shadow-[0_0_15px_rgb(var(--color-theme-500-rgb)/0.1)]"
        )}
      >
        <h3 className="text-xl font-semibold text-left text-theme-600 dark:text-theme-400">
          {question}
        </h3>
      </div>
      <div className="p-6 rounded-b-lg bg-card/50 dark:bg-card/30 border-x border-b border-theme-200 dark:border-theme-500/20 flex-1">
        {answer}
      </div>
    </div>
  );
};

interface FAQData {
  general: FAQItemProps[];
  earlyAccess: FAQItemProps[];
}


interface FAQSectionProps {
  isEarlyAccess?: boolean;
}

export function FAQSection({ isEarlyAccess = false }: FAQSectionProps) {
  const { t } = useTranslation();

  const faqData: FAQData = {
    earlyAccess: [
      {
        question: "When will the course be available?",
        answer: (
          <p className="text-muted-foreground">
            The course is currently in development and will be launching soon.
            Early access subscribers will be the first to know when it's ready and
            will receive exclusive preview content leading up to the launch.
          </p>
        ),
      },
      {
        question: "What do I get by signing up for early access?",
        answer: (
          <p className="text-muted-foreground">
            Early access subscribers receive exclusive preview content, first
            access to the course when it launches, priority support, and special
            early bird pricing. You'll also get updates on our development
            progress and sneak peeks at the curriculum.
          </p>
        ),
      },
      {
        question: "How will I be notified when the course launches?",
        answer: (
          <p className="text-muted-foreground">
            You'll receive email notifications with launch details, access
            instructions, and exclusive early access content. We'll also provide
            updates throughout the development process to keep you informed of our
            progress.
          </p>
        ),
      },
      {
        question: "Will early access subscribers get a discount?",
        answer: (
          <p className="text-muted-foreground">
            Yes! Early access subscribers will receive exclusive early bird
            pricing and special launch discounts. The earlier you join our waiting
            list, the better the offer you'll receive when the course becomes
            available.
          </p>
        ),
      },
      {
        question: "What's included in the early access preview?",
        answer: (
          <p className="text-muted-foreground">
            Early access previews include sample lessons, AI development
            templates, exclusive prompts and configurations, behind-the-scenes
            development updates, and early access to our community Discord where
            you can connect with other future agentic developers.
          </p>
        ),
      },
    ],
    general: [
      {
        question: t("home.faq.q1"),
        answer: <p className="text-muted-foreground">{t("home.faq.a1")}</p>,
      },
      {
        question: t("home.faq.q2"),
        answer: <p className="text-muted-foreground">{t("home.faq.a2")}</p>,
      },
      {
        question: t("home.faq.q3"),
        answer: <p className="text-muted-foreground">{t("home.faq.a3")}</p>,
      },
      {
        question: t("home.faq.q4"),
        answer: <p className="text-muted-foreground">{t("home.faq.a4")}</p>,
      },
      {
        question: t("home.faq.q5"),
        answer: <p className="text-muted-foreground">{t("home.faq.a5")}</p>,
      },
      {
        question: t("home.faq.q6"),
        answer: <p className="text-muted-foreground">{t("home.faq.a6")}</p>,
      },
      {
        question: t("home.faq.q7"),
        answer: <p className="text-muted-foreground">{t("home.faq.a7")}</p>,
      },
      {
        question: t("home.faq.q8"),
        answer: <p className="text-muted-foreground">{t("home.faq.a8")}</p>,
      },
      {
        question: t("home.faq.q9"),
        answer: <p className="text-muted-foreground">{t("home.faq.a9")}</p>,
      },
      {
        question: t("home.faq.q10"),
        answer: <p className="text-muted-foreground">{t("home.faq.a10")}</p>,
      },
      {
        question: t("home.faq.q11"),
        answer: <p className="text-muted-foreground">{t("home.faq.a11")}</p>,
      },
      {
        question: t("home.faq.q12"),
        answer: <p className="text-muted-foreground">{t("home.faq.a12")}</p>,
      },
    ],
  };

  const questionsToShow = isEarlyAccess
    ? [...faqData.earlyAccess, ...faqData.general.slice(0, 6)]
    : faqData.general;
  return (
    <section className="relative w-full py-24 overflow-hidden">
      {/* Modern AI-themed gradient background - matching hero */}
      <div className="absolute inset-0 hero-background-ai"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-theme-500/5 dark:via-theme-950/20 to-transparent"></div>

      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.4]">
        <DotPattern
          width={24}
          height={24}
          cx={1}
          cy={1}
          cr={1}
          className="fill-cyan-600/20 dark:fill-cyan-500/20"
        />
      </div>

      {/* AI-themed floating elements */}
      <div className="floating-elements">
        <div className="floating-element-1"></div>
        <div className="floating-element-2"></div>
        <div className="floating-element-3"></div>
        <div className="floating-element-small top-10 right-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center mb-16 text-center">
            {/* Badge - matching hero style */}
            <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-theme-50/50 dark:bg-background/20 backdrop-blur-sm border border-theme-200 dark:border-border/50 text-theme-600 dark:text-theme-400 text-xs md:text-sm font-medium mb-6 md:mb-8">
              <span className="w-2 h-2 bg-theme-500 dark:bg-theme-400 rounded-full mr-2"></span>
              {t("home.faq.badge")}
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-6xl leading-tight mb-6 md:mb-8">
              {t("home.faq.headingLine1")}{" "}
              <span className="text-theme-400">{t("home.faq.headingLine2")}</span>
            </h2>

            <p className="text-sm md:text-base lg:text-lg text-description mb-8 md:mb-12 max-w-3xl mx-auto">
              {t("home.faq.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questionsToShow.map((faq, index) => (
              <div
                key={index}
                className="h-full flex"
              >
                <FAQItem question={faq.question} answer={faq.answer} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade with theme accent - matching hero */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      <div className="section-divider-glow-bottom"></div>
    </section>
  );
}
