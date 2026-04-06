import { createAuthClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];

export async function POST(request: Request) {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large. Max 2MB." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type. Use PNG, JPG, SVG, or WebP." }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "png";
  const path = `branding/logo-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Delete old logo if exists
  const { data: oldContent } = await supabase
    .from("site_content")
    .select("content")
    .eq("page_key", "branding")
    .single();

  if (oldContent?.content?.logo_path) {
    await supabase.storage.from("public-assets").remove([oldContent.content.logo_path]);
  }

  // Upload new logo
  const { error: uploadErr } = await supabase.storage
    .from("public-assets")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from("public-assets").getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  // Update branding content
  const { data: existing } = await supabase
    .from("site_content")
    .select("content")
    .eq("page_key", "branding")
    .single();

  const newContent = {
    ...(existing?.content || {}),
    logo_path: publicUrl,
  };

  const { error: dbErr } = await supabase
    .from("site_content")
    .upsert({ page_key: "branding", content: newContent }, { onConflict: "page_key" });

  if (dbErr) {
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, logo_path: publicUrl });
}

export async function DELETE() {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get current logo path
  const { data: content } = await supabase
    .from("site_content")
    .select("content")
    .eq("page_key", "branding")
    .single();

  if (content?.content?.logo_path) {
    // Extract storage path from URL
    const url = content.content.logo_path;
    const match = url.match(/public-assets\/(.+)$/);
    if (match) {
      await supabase.storage.from("public-assets").remove([match[1]]);
    }
  }

  // Update branding content
  const newContent = {
    ...(content?.content || {}),
    logo_path: "",
  };

  await supabase
    .from("site_content")
    .upsert({ page_key: "branding", content: newContent }, { onConflict: "page_key" });

  return NextResponse.json({ success: true });
}
