import { createClient } from "@supabase/supabase-js";
import { defaults } from "./defaults";
import type { ContentMap, PageKey } from "./types";

export async function getContent<K extends PageKey>(
  pageKey: K
): Promise<ContentMap[K]> {
  const fallback = defaults[pageKey];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("page_key", pageKey)
      .single();

    if (error || !data) return fallback;

    return { ...fallback, ...data.content } as ContentMap[K];
  } catch {
    return fallback;
  }
}
