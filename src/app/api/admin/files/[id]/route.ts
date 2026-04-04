import { createAuthClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface Props { params: Promise<{ id: string }> }

export async function DELETE(_req: Request, { params }: Props) {
  const { id } = await params;
  const supabase = await createAuthClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get file to find storage path
  const { data: file } = await supabase
    .from("project_files")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete from storage
  await supabase.storage.from("project-files").remove([file.storage_path]);

  // Delete from DB
  const { error } = await supabase.from("project_files").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
