import { createAuthClient } from "@/lib/supabase/server";
import { StatsRow } from "@/components/admin/stats-row";
import { UploadZone } from "@/components/admin/upload-zone";
import { FilesTable } from "@/components/admin/files-table";

export default async function FilesPage() {
  const supabase = await createAuthClient();

  const { data: files } = await supabase
    .from("project_files")
    .select("id, display_name, size_bytes, created_at")
    .order("created_at", { ascending: true });

  const { data: apps } = await supabase
    .from("applications")
    .select("id")
    .eq("files_released", true);

  const allFiles = files || [];
  const totalSize = allFiles.reduce((sum, f) => sum + (f.size_bytes || 0), 0);

  const stats = [
    { label: "Files uploaded", value: allFiles.length },
    { label: "Active recipients", value: apps?.length || 0 },
    { label: "Total size (MB)", value: Math.round(totalSize / (1024 * 1024) * 10) / 10 || 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">File Manager</h1>
      <StatsRow stats={stats} />
      <UploadZone />
      <FilesTable files={allFiles} />
    </div>
  );
}
