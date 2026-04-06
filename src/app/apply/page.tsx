import { getContent } from "@/lib/content/get-content";
import { Nav } from "@/components/landing/nav";
import { SteppedForm } from "@/components/apply/stepped-form";

export default async function ApplyPage() {
  const content = await getContent("apply");
  const branding = await getContent("branding");

  return (
    <div className="min-h-screen bg-background">
      <Nav logoPath={branding.logo_path} />
      <main className="w-full max-w-[520px] mx-auto px-6 pb-16">
        <SteppedForm content={content} />
      </main>
    </div>
  );
}
