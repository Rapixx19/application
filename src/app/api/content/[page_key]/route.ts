import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { defaults } from "@/lib/content/defaults";
import type { PageKey } from "@/lib/content/types";

interface Props { params: Promise<{ page_key: string }> }

export async function GET(_req: Request, { params }: Props) {
  const { page_key } = await params;

  const fallback = defaults[page_key as PageKey];
  if (!fallback) return NextResponse.json({ error: "Invalid page key" }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("page_key", page_key)
    .single();

  return NextResponse.json(data ? { ...fallback, ...data.content } : fallback);
}
