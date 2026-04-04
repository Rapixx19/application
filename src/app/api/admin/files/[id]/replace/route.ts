import { createAuthClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface Props { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Props) {
  const { id } = await params;
  const supabase = await createAuthClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  // Get current file
  const { data: current } = await supabase
    .from("project_files")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Remove old, upload new
  await supabase.storage.from("project-files").remove([current.storage_path]);

  const path = `uploads/${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadErr } = await supabase.storage
    .from("project-files")
    .upload(path, buffer, { contentType: file.type });

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 });

  await supabase.from("project_files").update({
    storage_path: path,
    display_name: file.name,
    size_bytes: file.size,
    mime_type: file.type,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  return NextResponse.json({ success: true });
}
