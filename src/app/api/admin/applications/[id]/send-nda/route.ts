import { createAuthClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send";
import { NdaInvitationEmail } from "@/lib/email/templates/nda-invitation";

interface Props { params: Promise<{ id: string }> }

export async function POST(_req: Request, { params }: Props) {
  const { id } = await params;
  const supabase = await createAuthClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

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
      subject: "You\u2019ve been selected \u2014 Sentavita",
      react: NdaInvitationEmail({ name: app.full_name, ndaUrl: `${appUrl}/nda/${ndaToken}` }),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, nda_token: ndaToken });
}
