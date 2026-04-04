import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send";
import { FilesReleasedEmail } from "@/lib/email/templates/files-released";

export async function POST(request: Request) {
  try {
    const { token, signed_name } = await request.json();

    if (!token || !signed_name?.trim()) {
      return NextResponse.json({ error: "Token and name are required." }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Find application by token
    const { data: app, error: findErr } = await supabase
      .from("applications")
      .select("id, status, nda_token_expires, welcome_token")
      .eq("nda_token", token)
      .single();

    if (findErr || !app) {
      return NextResponse.json({ error: "Invalid token." }, { status: 404 });
    }

    if (app.status === "nda_signed" || app.status === "files_released") {
      return NextResponse.json({ error: "NDA already signed." }, { status: 409 });
    }

    if (app.nda_token_expires && new Date(app.nda_token_expires) < new Date()) {
      return NextResponse.json({ error: "Token expired." }, { status: 410 });
    }

    // Generate welcome token if not exists
    const welcomeToken = app.welcome_token || crypto.randomUUID();

    // Update application: sign NDA + release files
    const { error: updateErr } = await supabase
      .from("applications")
      .update({
        status: "nda_signed",
        nda_signed_at: new Date().toISOString(),
        nda_signed_name: signed_name.trim(),
        files_released: true,
        files_released_at: new Date().toISOString(),
        welcome_token: welcomeToken,
      })
      .eq("id", app.id);

    if (updateErr) {
      console.error("NDA sign error:", updateErr);
      return NextResponse.json({ error: "Failed to record signature." }, { status: 500 });
    }

    // Send welcome email
    const { data: applicant } = await supabase
      .from("applications")
      .select("full_name, email")
      .eq("id", app.id)
      .single();

    if (applicant) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      sendEmail({
        to: applicant.email,
        subject: "Welcome to Sentavita \u2014 your project files are ready",
        react: FilesReleasedEmail({ name: applicant.full_name, welcomeUrl: `${appUrl}/welcome/${welcomeToken}` }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, welcome_token: welcomeToken });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
