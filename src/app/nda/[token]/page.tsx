import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { getContent } from "@/lib/content/get-content";
import { Nav } from "@/components/landing/nav";
import { NdaTextBox } from "@/components/nda/nda-text-box";
import { NdaSignClient } from "./nda-sign-client";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function NdaPage({ params }: Props) {
  const { token } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: app } = await supabase
    .from("applications")
    .select("id, status, nda_token_expires")
    .eq("nda_token", token)
    .single();

  // Invalid token or already signed
  if (!app || app.status === "nda_signed" || app.status === "files_released") {
    redirect("/");
  }

  // Expired token (30 days)
  if (app.nda_token_expires && new Date(app.nda_token_expires) < new Date()) {
    redirect("/");
  }

  const content = await getContent("nda");
  const branding = await getContent("branding");

  return (
    <div className="min-h-screen bg-background">
      <Nav logoPath={branding.logo_path} />
      <main className="w-full max-w-[520px] mx-auto px-6 pb-16">
        <div className="text-xs font-medium tracking-[0.15em] uppercase text-green mb-4">
          {content.eyebrow}
        </div>
        <h1 className="font-serif text-4xl font-bold text-primary mb-3">
          {content.headline}
        </h1>
        <p className="text-[0.95rem] text-muted leading-7 mb-8">
          {content.body}
        </p>

        <NdaTextBox text={content.nda_text} />
        <NdaSignClient token={token} signatureNote={content.signature_note} />
      </main>
    </div>
  );
}
