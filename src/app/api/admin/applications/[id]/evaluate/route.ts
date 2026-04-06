import { createAuthClient } from "@/lib/supabase/server";
import { evaluateApplication } from "@/lib/ai/evaluate";
import { NextResponse } from "next/server";
import type { ApplicationForEvaluation } from "@/lib/ai/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createAuthClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch application
  const { data: app, error: fetchError } = await supabase
    .from("applications")
    .select("full_name, country, institution, background, roles, role_details, motivation, portfolio_url")
    .eq("id", id)
    .single();

  if (fetchError || !app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  try {
    const evaluation = await evaluateApplication(app as ApplicationForEvaluation);

    // Update application with AI evaluation
    const { error: updateError } = await supabase
      .from("applications")
      .update({ ai_evaluation: evaluation })
      .eq("id", id);

    if (updateError) {
      console.error("Failed to save evaluation:", updateError);
      return NextResponse.json({ error: "Failed to save evaluation" }, { status: 500 });
    }

    return NextResponse.json({ success: true, evaluation });
  } catch (err) {
    console.error("AI evaluation failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Evaluation failed" },
      { status: 500 }
    );
  }
}
