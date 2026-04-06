import { createAuthClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_AUDIO_SIZE = 20 * 1024 * 1024; // 20MB

const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/aac"];

export async function POST(request: Request) {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const mediaType = formData.get("type") as string; // "video" or "music"

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!mediaType || !["video", "music"].includes(mediaType)) {
    return NextResponse.json({ error: "Invalid media type" }, { status: 400 });
  }

  const isVideo = mediaType === "video";
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_AUDIO_SIZE;
  const allowedTypes = isVideo ? VIDEO_TYPES : AUDIO_TYPES;

  if (file.size > maxSize) {
    return NextResponse.json({
      error: `File too large. Max ${isVideo ? "100MB" : "20MB"}.`
    }, { status: 400 });
  }

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({
      error: isVideo
        ? "Invalid video format. Use MP4, WebM, or MOV."
        : "Invalid audio format. Use MP3, WAV, OGG, or AAC."
    }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || (isVideo ? "mp4" : "mp3");
  const path = `splash/${mediaType}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Delete old file if exists
  const { data: oldContent } = await supabase
    .from("site_content")
    .select("content")
    .eq("page_key", "splash")
    .single();

  const oldUrl = isVideo ? oldContent?.content?.video_url : oldContent?.content?.music_url;
  if (oldUrl) {
    const match = oldUrl.match(/public-assets\/(.+)$/);
    if (match) {
      await supabase.storage.from("public-assets").remove([match[1]]);
    }
  }

  // Upload new file
  const { error: uploadErr } = await supabase.storage
    .from("public-assets")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from("public-assets").getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  // Update splash content
  const newContent = {
    ...(oldContent?.content || {}),
    [isVideo ? "video_url" : "music_url"]: publicUrl,
  };

  const { error: dbErr } = await supabase
    .from("site_content")
    .upsert({ page_key: "splash", content: newContent }, { onConflict: "page_key" });

  if (dbErr) {
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, url: publicUrl });
}

export async function DELETE(request: Request) {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get("type");

  if (!mediaType || !["video", "music"].includes(mediaType)) {
    return NextResponse.json({ error: "Invalid media type" }, { status: 400 });
  }

  const isVideo = mediaType === "video";

  // Get current content
  const { data: content } = await supabase
    .from("site_content")
    .select("content")
    .eq("page_key", "splash")
    .single();

  const url = isVideo ? content?.content?.video_url : content?.content?.music_url;
  if (url) {
    const match = url.match(/public-assets\/(.+)$/);
    if (match) {
      await supabase.storage.from("public-assets").remove([match[1]]);
    }
  }

  // Update splash content
  const newContent = {
    ...(content?.content || {}),
    [isVideo ? "video_url" : "music_url"]: "",
  };

  await supabase
    .from("site_content")
    .upsert({ page_key: "splash", content: newContent }, { onConflict: "page_key" });

  return NextResponse.json({ success: true });
}
