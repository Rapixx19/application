import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

interface Props {
  params: Promise<{ token: string }>;
}

interface FileWithFolder {
  id: string;
  display_name: string;
  size_bytes: number;
  storage_path: string;
  folder: { id: string; name: string } | null;
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

  // Get files assigned to this application (via application_files table)
  const { data: assignedFiles } = await supabase
    .from("application_files")
    .select(`
      file:project_files (
        id,
        display_name,
        size_bytes,
        storage_path,
        folder:file_folders (
          id,
          name
        )
      )
    `)
    .eq("application_id", app.id)
    .not("released_at", "is", null);

  let files: FileWithFolder[] = [];

  if (assignedFiles && assignedFiles.length > 0) {
    // Extract file data from join result and normalize folder structure
    files = assignedFiles
      .map((af) => {
        const file = af.file as unknown as {
          id: string;
          display_name: string;
          size_bytes: number;
          storage_path: string;
          folder: { id: string; name: string }[] | { id: string; name: string } | null;
        };
        if (!file) return null;

        // Supabase returns folder as array for joins, take first element
        const folderData = Array.isArray(file.folder) ? file.folder[0] : file.folder;

        return {
          id: file.id,
          display_name: file.display_name,
          size_bytes: file.size_bytes,
          storage_path: file.storage_path,
          folder: folderData || null,
        };
      })
      .filter((f): f is FileWithFolder => f !== null);
  } else {
    // Backwards compatibility: if no application_files, return all project_files
    const { data: allFiles } = await supabase
      .from("project_files")
      .select(`
        id,
        display_name,
        size_bytes,
        storage_path,
        folder:file_folders (
          id,
          name
        )
      `)
      .order("created_at", { ascending: true });

    if (allFiles) {
      files = allFiles.map((file) => {
        const folderData = Array.isArray(file.folder) ? file.folder[0] : file.folder;
        return {
          id: file.id,
          display_name: file.display_name,
          size_bytes: file.size_bytes,
          storage_path: file.storage_path,
          folder: folderData || null,
        };
      });
    }
  }

  if (files.length === 0) {
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
        folder_name: file.folder?.name || null,
        folder_id: file.folder?.id || null,
      };
    })
  );

  return NextResponse.json(withUrls);
}
