import { createAuthClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send";
import { NdaInvitationEmail } from "@/lib/email/templates/nda-invitation";

interface Props { params: Promise<{ id: string }> }

export async function POST(req: Request, { params }: Props) {
  const { id } = await params;
  const supabase = await createAuthClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Parse request body for file_ids
  let fileIds: string[] = [];
  try {
    const body = await req.json();
    fileIds = body.file_ids || [];
  } catch {
    // No body provided, will use default files
  }

  // If no file_ids provided, use all files marked as default
  if (fileIds.length === 0) {
    const { data: defaultFiles } = await supabase
      .from("project_files")
      .select("id")
      .eq("is_default", true);
    fileIds = (defaultFiles || []).map(f => f.id);
  }

  const ndaToken = crypto.randomUUID();
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);

  const { error } = await supabase
    .from("applications")
    .update({
      status: "nda_sent",
      nda_token: ndaToken,
      nda_token_expires: expires.toISOString(),
      nda_sent_at: new Date().toISOString(),
      release_scheduled_at: null, // Reset any previous schedule
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Clear any existing file assignments for this application
  await supabase
    .from("application_files")
    .delete()
    .eq("application_id", id);

  // Save selected files to application_files (not released yet)
  if (fileIds.length > 0) {
    const fileAssignments = fileIds.map(fileId => ({
      application_id: id,
      file_id: fileId,
      assigned_at: new Date().toISOString(),
      released_at: null,
    }));

    const { error: insertErr } = await supabase
      .from("application_files")
      .insert(fileAssignments);

    if (insertErr) {
      console.error("Failed to save file assignments:", insertErr);
    }
  }

  // Send NDA email
  const { data: app } = await supabase
    .from("applications")
    .select("full_name, email")
    .eq("id", id)
    .single();

  if (app) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    sendEmail({
      to: app.email,
      subject: "You've been selected — Sentavita",
      react: NdaInvitationEmail({ name: app.full_name, ndaUrl: `${appUrl}/nda/${ndaToken}` }),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, nda_token: ndaToken, files_assigned: fileIds.length });
}
