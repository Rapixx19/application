import { getContent } from "@/lib/content/get-content";
import { SplashOverlay } from "@/components/splash-overlay";
import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { StatsGrid } from "@/components/landing/stats-grid";
import { CalloutBlock } from "@/components/landing/callout-block";
import { RoleCards } from "@/components/landing/role-cards";
import { OfferCards } from "@/components/landing/offer-cards";
import { Section } from "@/components/landing/section";
import Link from "next/link";

export default async function Home() {
  const splash = await getContent("splash");
  const landing = await getContent("landing");
  const branding = await getContent("branding");
  const { sections, commitment } = landing;

  return (
    <>
      <SplashOverlay
        wordmark={splash.wordmark}
        tagline={splash.tagline}
        duration={splash.duration}
        logoPath={branding.logo_path}
      />

      <div className="flex flex-col min-h-screen bg-background">
        <Nav logoPath={branding.logo_path} />

        <main className="flex-1 w-full max-w-[720px] mx-auto px-6 pb-16">
          <Hero hero={landing.hero} />

          <Section
            title={sections.who_we_are}
            body={sections.who_we_are_body}
            body2={sections.who_we_are_body_2}
          >
            <StatsGrid stats={landing.stats} />
          </Section>

          <Section
            title={sections.what_we_build}
            body={sections.what_we_build_body}
          >
            <CalloutBlock callout={landing.callout} />
          </Section>

          <Section
            title={sections.who_we_seek}
            body={sections.who_we_seek_body}
          >
            <RoleCards roles={landing.roles} />
          </Section>

          <Section
            title={sections.what_we_offer}
            body={sections.what_we_offer_body}
          >
            <OfferCards offers={landing.offers} />
          </Section>

          <div className="h-px bg-border my-12" />

          <Section title={sections.commitment} body={commitment.body}>
            <div className="mt-8">
              <Link
                href={commitment.cta_link}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-lg text-sm font-medium transition-colors hover:bg-[#2d3748]"
              >
                {commitment.cta_text}
              </Link>
            </div>
          </Section>
        </main>
      </div>
    </>
  );
}
