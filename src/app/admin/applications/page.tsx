import { createAuthClient } from "@/lib/supabase/server";
import { StatsRow } from "@/components/admin/stats-row";
import { ApplicationsTable } from "@/components/admin/applications-table";

export default async function ApplicationsPage() {
  const supabase = await createAuthClient();

  const { data: applications } = await supabase
    .from("applications")
    .select("id, full_name, email, roles, country, admin_rating, created_at, status, ai_evaluation")
    .order("created_at", { ascending: false });

  const apps = applications || [];

  const stats = [
    { label: "Total received", value: apps.length },
    { label: "Pending review", value: apps.filter((a) => a.status === "pending").length },
    { label: "NDA sent", value: apps.filter((a) => a.status === "nda_sent").length },
    { label: "Files released", value: apps.filter((a) => a.status === "files_released").length },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Applications</h1>
      <StatsRow stats={stats} />
      <ApplicationsTable applications={apps} />
    </div>
  );
}
