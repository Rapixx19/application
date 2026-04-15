import { createAuthClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get files with folder info
  const { data: files } = await supabase
    .from("project_files")
    .select("*, folder:file_folders(id, name)")
    .order("created_at", { ascending: true });

  // Get all folders
  const { data: folders } = await supabase
    .from("file_folders")
    .select("*")
    .order("created_at", { ascending: true });

  return NextResponse.json({ files: files || [], folders: folders || [] });
}

export async function POST(request: Request) {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const path = `uploads/${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadErr } = await supabase.storage
    .from("project-files")
    .upload(path, buffer, { contentType: file.type });

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 });

  const { error: dbErr } = await supabase.from("project_files").insert({
    storage_path: path,
    display_name: file.name,
    size_bytes: file.size,
    mime_type: file.type,
    uploaded_by: user.id,
  });

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
