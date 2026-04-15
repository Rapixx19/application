import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send";
import { FilesReleasedEmail } from "@/lib/email/templates/files-released";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Verify cron secret for security (Vercel sends this header)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  // Find applications ready for release:
  // - release_scheduled_at is in the past
  // - files_released = false
  // - status = nda_signed
  const now = new Date().toISOString();
  const { data: applications, error } = await supabase
    .from("applications")
    .select("id, full_name, email, welcome_token")
    .eq("status", "nda_signed")
    .eq("files_released", false)
    .lte("release_scheduled_at", now)
    .not("release_scheduled_at", "is", null);

  if (error) {
    console.error("Cron: Error fetching applications:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!applications || applications.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  let processed = 0;

  for (const app of applications) {
    try {
      // Mark application_files as released
      const { error: releaseFilesErr } = await supabase
        .from("application_files")
        .update({ released_at: now })
        .eq("application_id", app.id)
        .is("released_at", null);

      if (releaseFilesErr) {
        console.error(`Cron: Error releasing files for ${app.id}:`, releaseFilesErr);
        continue;
      }

      // Update application status
      const { error: updateErr } = await supabase
        .from("applications")
        .update({
          files_released: true,
          files_released_at: now,
          status: "files_released",
        })
        .eq("id", app.id);

      if (updateErr) {
        console.error(`Cron: Error updating application ${app.id}:`, updateErr);
        continue;
      }

      // Send welcome email
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      await sendEmail({
        to: app.email,
        subject: "Welcome to Sentavita — your project files are ready",
        react: FilesReleasedEmail({
          name: app.full_name,
          welcomeUrl: `${appUrl}/welcome/${app.welcome_token}`,
        }),
      });

      processed++;
    } catch (err) {
      console.error(`Cron: Error processing application ${app.id}:`, err);
    }
  }

  return NextResponse.json({ processed, total: applications.length });
}
