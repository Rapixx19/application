import { createClient } from "@supabase/supabase-js";
import { NextResponse, after } from "next/server";
import { sendEmail, ADMINS } from "@/lib/email/send";
import { ApplicationReceivedEmail } from "@/lib/email/templates/application-received";
import { AdminAlertEmail } from "@/lib/email/templates/admin-alert";
import { evaluateApplication } from "@/lib/ai/evaluate";
import type { ApplicationForEvaluation } from "@/lib/ai/types";

const MAX_CV_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const dataStr = formData.get("data") as string;
    const cvFile = formData.get("cv") as File | null;

    if (!dataStr) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const body = JSON.parse(dataStr);
    const { full_name, email, country, institution, background, roles, role_details, portfolio_url, motivation } = body;

    // Validate required fields
    if (!full_name?.trim() || !email?.includes("@") || !country || !institution?.trim() || !background || !roles?.length || !motivation?.trim()) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    // Validate CV file if provided
    if (cvFile) {
      if (cvFile.size > MAX_CV_SIZE) {
        return NextResponse.json({ error: "CV file size must be less than 10MB." }, { status: 400 });
      }
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(cvFile.type)) {
        return NextResponse.json({ error: "CV must be a PDF or Word document." }, { status: 400 });
      }
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Upload CV if provided
    let cvPath: string | null = null;
    if (cvFile) {
      const fileExt = cvFile.name.split(".").pop();
      const fileName = `${Date.now()}-${email.trim().toLowerCase().replace(/[^a-z0-9]/g, "_")}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("application-cvs")
        .upload(fileName, cvFile, {
          contentType: cvFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("CV upload error:", uploadError);
        // Continue without CV if upload fails - don't block the application
      } else {
        cvPath = uploadData?.path ?? null;
      }
    }

    const applicationData = {
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      country,
      institution: institution.trim(),
      background,
      roles,
      role_details: role_details || {},
      portfolio_url: portfolio_url?.trim() || null,
      motivation: motivation.trim(),
      cv_path: cvPath,
      status: "pending",
    };

    const { data: inserted, error } = await supabase
      .from("applications")
      .insert(applicationData)
      .select("id")
      .single();

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

    // Trigger AI evaluation in the background after response is sent
    if (inserted?.id && process.env.ANTHROPIC_API_KEY) {
      after(async () => {
        try {
          const appForEval: ApplicationForEvaluation = {
            full_name: applicationData.full_name,
            country: applicationData.country,
            institution: applicationData.institution,
            background: applicationData.background,
            roles: applicationData.roles,
            role_details: applicationData.role_details,
            motivation: applicationData.motivation,
            portfolio_url: applicationData.portfolio_url,
          };

          const evaluation = await evaluateApplication(appForEval);

          await supabase
            .from("applications")
            .update({ ai_evaluation: evaluation })
            .eq("id", inserted.id);

          console.log(`AI evaluation completed for application ${inserted.id}`);
        } catch (err) {
          console.error(`AI evaluation failed for application ${inserted.id}:`, err);
        }
      });
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
