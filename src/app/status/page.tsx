import { getContent } from "@/lib/content/get-content";
import { Nav } from "@/components/landing/nav";
import { StatusLookup } from "@/components/status/status-lookup";

export default async function StatusPage() {
  const content = await getContent("status");
  const branding = await getContent("branding");

  return (
    <div className="min-h-screen bg-background">
      <Nav logoPath={branding.logo_path} />
      <main className="w-full max-w-[520px] mx-auto px-6 pb-16">
        <h1 className="font-serif text-4xl font-bold text-primary mb-4">
          {content.headline}
        </h1>
        <p className="text-[0.95rem] text-muted leading-7 mb-8">
          {content.body}
        </p>
        <StatusLookup />
      </main>
    </div>
  );
}
