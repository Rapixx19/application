import Link from "next/link";
import { notFound } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/admin/status-badge";
import { ProgressTracker } from "@/components/admin/progress-tracker";
import { DetailCards } from "@/components/admin/detail-cards";
import { MotivationQuote } from "@/components/admin/motivation-quote";
import { RatingSection } from "@/components/admin/rating-section";
import { ActionBar } from "@/components/admin/action-bar";
import { FileActivityTable } from "@/components/admin/file-activity-table";
import { AIEvaluationCard } from "@/components/admin/ai-evaluation-card";
import type { AIEvaluation } from "@/lib/ai/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ApplicantDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createAuthClient();

  const { data: app } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (!app) notFound();

  const { data: activities } = await supabase
    .from("file_activity")
    .select("file_name, opened_at, session_seconds")
    .eq("application_id", id)
    .order("opened_at", { ascending: false });

  const applied = new Date(app.created_at).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const fields = [
    { label: "Email", value: app.email },
    { label: "Background", value: app.background || "" },
    { label: "Country", value: app.country || "" },
    { label: "Institution", value: app.institution || "" },
    { label: "Role interest", value: app.roles?.join(", ") || "" },
    { label: "Portfolio", value: app.portfolio_url || "", isLink: true },
  ];

  return (
    <div>
      <Link href="/admin/applications" className="text-sm text-muted hover:text-primary mb-4 inline-block">
        &larr; Back to applications
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">{app.full_name}</h1>
          <p className="text-sm text-muted mt-1">
            {app.roles?.join(" \u00b7 ")} &middot; {app.country} &middot; Applied {applied}
          </p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <ProgressTracker status={app.status} />
      <AIEvaluationCard
        applicationId={app.id}
        evaluation={app.ai_evaluation as AIEvaluation | null}
      />
      <DetailCards fields={fields} />
      <MotivationQuote text={app.motivation || ""} />
      <RatingSection
        applicationId={app.id}
        initialRating={app.admin_rating || 0}
        initialNotes={app.admin_notes || ""}
      />
      <ActionBar
        applicationId={app.id}
        status={app.status}
        applicantName={app.full_name}
        releaseScheduledAt={app.release_scheduled_at}
        filesReleased={app.files_released}
      />

      {app.status === "files_released" && (
        <FileActivityTable activities={activities || []} />
      )}
    </div>
  );
}
