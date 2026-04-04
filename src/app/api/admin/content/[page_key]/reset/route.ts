import { createAuthClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface Props { params: Promise<{ page_key: string }> }

export async function POST(_req: Request, { params }: Props) {
  const { page_key } = await params;
  const supabase = await createAuthClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Delete the custom content so defaults are used
  await supabase
    .from("site_content")
    .delete()
    .eq("page_key", page_key);

  return NextResponse.json({ success: true });
}
