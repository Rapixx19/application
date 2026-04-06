import { getContent } from "@/lib/content/get-content";
import { Nav } from "@/components/landing/nav";

export default async function SubmittedPage() {
  const content = await getContent("submitted");
  const branding = await getContent("branding");

  const steps = content.next_steps.map((text) => {
    const dash = text.indexOf("\u2014");
    if (dash === -1) return { title: text, description: "" };
    return { title: text.slice(0, dash).trim(), description: text.slice(dash + 1).trim() };
  });

  return (
    <div className="min-h-screen bg-background">
      <Nav logoPath={branding.logo_path} />
      <main className="w-full max-w-[520px] mx-auto px-6 pb-16 text-center">
        {/* Check icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-green/10 border-2 border-green flex items-center justify-center mb-8">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d8a5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="font-serif text-4xl font-bold text-primary mb-4">
          {content.headline}
        </h1>
        <p className="text-[0.95rem] text-muted leading-7 mb-10">
          {content.body}
        </p>

        {/* Next steps */}
        <div className="space-y-4 text-left">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary">{step.title}</h3>
                {step.description && (
                  <p className="text-[0.85rem] text-muted leading-relaxed mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
