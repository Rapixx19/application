import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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

    // Schedule file release for 10 minutes from now
    const releaseAt = new Date();
    releaseAt.setMinutes(releaseAt.getMinutes() + 10);

    // Update application: sign NDA + schedule release (NOT immediate release)
    const { error: updateErr } = await supabase
      .from("applications")
      .update({
        status: "nda_signed",
        nda_signed_at: new Date().toISOString(),
        nda_signed_name: signed_name.trim(),
        welcome_token: welcomeToken,
        release_scheduled_at: releaseAt.toISOString(),
        // files_released stays false until cron releases them
      })
      .eq("id", app.id);

    if (updateErr) {
      console.error("NDA sign error:", updateErr);
      return NextResponse.json({ error: "Failed to record signature." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      welcome_token: welcomeToken,
      release_scheduled_at: releaseAt.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
