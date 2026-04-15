import { createAuthClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send";
import { FilesReleasedEmail } from "@/lib/email/templates/files-released";

interface Props { params: Promise<{ id: string }> }

export async function POST(_req: Request, { params }: Props) {
  const { id } = await params;
  const supabase = await createAuthClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get existing welcome token if any
  const { data: app } = await supabase
    .from("applications")
    .select("welcome_token, full_name, email")
    .eq("id", id)
    .single();

  const welcomeToken = app?.welcome_token || crypto.randomUUID();
  const now = new Date().toISOString();

  // Mark application_files as released
  await supabase
    .from("application_files")
    .update({ released_at: now })
    .eq("application_id", id)
    .is("released_at", null);

  const { error } = await supabase
    .from("applications")
    .update({
      status: "files_released",
      files_released: true,
      files_released_at: now,
      welcome_token: welcomeToken,
      release_scheduled_at: null, // Clear scheduled release
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send welcome email
  if (app?.email) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    sendEmail({
      to: app.email,
      subject: "Welcome to Sentavita — your project files are ready",
      react: FilesReleasedEmail({
        name: app.full_name,
        welcomeUrl: `${appUrl}/welcome/${welcomeToken}`,
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, welcome_token: welcomeToken });
}
