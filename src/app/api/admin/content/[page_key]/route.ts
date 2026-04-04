import { createAuthClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { defaults } from "@/lib/content/defaults";
import type { PageKey } from "@/lib/content/types";

interface Props { params: Promise<{ page_key: string }> }

export async function GET(_req: Request, { params }: Props) {
  const { page_key } = await params;
  const supabase = await createAuthClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("page_key", page_key)
    .single();

  const fallback = defaults[page_key as PageKey];
  if (!fallback) return NextResponse.json({ error: "Invalid page key" }, { status: 400 });

  return NextResponse.json(data ? { ...fallback, ...data.content } : fallback);
}

export async function PUT(request: Request, { params }: Props) {
  const { page_key } = await params;
  const supabase = await createAuthClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const content = await request.json();

  // Upsert content
  const { data: existing } = await supabase
    .from("site_content")
    .select("id")
    .eq("page_key", page_key)
    .single();

  if (existing) {
    await supabase
      .from("site_content")
      .update({ content, updated_at: new Date().toISOString(), updated_by: user.id })
      .eq("page_key", page_key);
  } else {
    await supabase
      .from("site_content")
      .insert({ page_key, content, updated_by: user.id });
  }

  return NextResponse.json({ success: true });
}
