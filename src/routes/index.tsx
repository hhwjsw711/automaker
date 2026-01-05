import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useEffect } from "react";
import { UnifiedHero } from "./-components/unified-hero";
import { StatsSection } from "./-components/stats";
import { ModulesSection } from "./-components/modules";
import { PricingSection } from "./-components/pricing";
import { FAQSection } from "./-components/faq";
import { TestimonialsSection } from "./-components/testimonials";
import { FutureOfCodingSection } from "./-components/future-of-coding";
import { ResearchSourcesSection } from "./-components/research-sources";
import { InstructorSection } from "./-components/instructor-section";
import { DiscordCommunitySection } from "./-components/discord-community-section";
import { NewsletterSection } from "./-components/newsletter";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const rootData = useLoaderData({ from: "__root__" });
  const shouldShowEarlyAccess = rootData?.shouldShowEarlyAccess ?? false;

  // Ensure page starts at top on initial load (prevents scroll restoration from jumping to subscribe section)
  useEffect(() => {
    // Use requestAnimationFrame to ensure this runs after browser's scroll restoration
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };

    // Immediate scroll
    scrollToTop();

    // Also ensure after a short delay in case browser tries to restore scroll position
    const timeoutId = setTimeout(scrollToTop, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b101a] text-slate-800 dark:text-slate-200">
      <div className="prism-bg" />
      <UnifiedHero isEarlyAccess={shouldShowEarlyAccess} />
      {shouldShowEarlyAccess && <DiscordCommunitySection />}
      <FutureOfCodingSection />
      <StatsSection />
      <ResearchSourcesSection />
      <ModulesSection isDisabled={shouldShowEarlyAccess} />
      {!shouldShowEarlyAccess && <NewsletterSection />}
      <InstructorSection />
      {!shouldShowEarlyAccess && <TestimonialsSection />}
      {!shouldShowEarlyAccess && <PricingSection />}
      <FAQSection isEarlyAccess={shouldShowEarlyAccess} />
    </div>
  );
}
