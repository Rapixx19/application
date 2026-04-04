import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail, ADMINS } from "@/lib/email/send";
import { ApplicationReceivedEmail } from "@/lib/email/templates/application-received";
import { AdminAlertEmail } from "@/lib/email/templates/admin-alert";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { full_name, email, country, institution, background, roles, role_details, portfolio_url, motivation } = body;

    // Validate required fields
    if (!full_name?.trim() || !email?.includes("@") || !country || !institution?.trim() || !background || !roles?.length || !motivation?.trim()) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from("applications").insert({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      country,
      institution: institution.trim(),
      background,
      roles,
      role_details: role_details || {},
      portfolio_url: portfolio_url?.trim() || null,
      motivation: motivation.trim(),
      status: "pending",
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "An application with this email already exists." },
          { status: 409 }
        );
      }
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }

    // Send emails (fire-and-forget)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    sendEmail({
      to: email.trim().toLowerCase(),
      subject: "Application received — Sentavita",
      react: ApplicationReceivedEmail({ name: full_name.trim() }),
    }).catch(() => {});
    sendEmail({
      to: ADMINS,
      subject: `New application: ${full_name.trim()}`,
      react: AdminAlertEmail({
        name: full_name.trim(),
        email: email.trim().toLowerCase(),
        roles,
        country,
        adminUrl: `${appUrl}/admin/applications`,
      }),
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
