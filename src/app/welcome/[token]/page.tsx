import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { getContent } from "@/lib/content/get-content";
import { Nav } from "@/components/landing/nav";
import { FileList } from "@/components/welcome/file-list";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function WelcomePage({ params }: Props) {
  const { token } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Validate token + files_released
  const { data: app } = await supabase
    .from("applications")
    .select("id, files_released, welcome_token")
    .eq("welcome_token", token)
    .single();

  if (!app) redirect("/");

  if (!app.files_released) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted text-sm">Files not yet released. Please check back later.</p>
      </div>
    );
  }

  const content = await getContent("welcome");
  const branding = await getContent("branding");

  // Fetch files with signed URLs
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/files/${token}`,
    { cache: "no-store" }
  );
  const files = res.ok ? await res.json() : [];

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
        <p className="text-[0.95rem] text-muted leading-7 mb-10">
          {content.body}
        </p>

        <FileList files={files} applicationId={app.id} />
      </main>
    </div>
  );
}
