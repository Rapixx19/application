import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

interface Props {
  params: Promise<{ token: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  const { token } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  // Validate token
  const { data: app } = await supabase
    .from("applications")
    .select("id, files_released")
    .eq("welcome_token", token)
    .single();

  if (!app || !app.files_released) {
    return NextResponse.json([], { status: 404 });
  }

  // Get all project files
  const { data: files } = await supabase
    .from("project_files")
    .select("id, display_name, size_bytes, storage_path")
    .order("created_at", { ascending: true });

  if (!files || files.length === 0) {
    return NextResponse.json([]);
  }

  // Generate signed URLs (1 hour expiry)
  const withUrls = await Promise.all(
    files.map(async (file) => {
      const { data } = await supabase.storage
        .from("project-files")
        .createSignedUrl(file.storage_path, 3600);

      return {
        id: file.id,
        display_name: file.display_name,
        size_bytes: file.size_bytes,
        url: data?.signedUrl || "",
      };
    })
  );

  return NextResponse.json(withUrls);
}
