import { createAuthClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface Props { params: Promise<{ id: string }> }

export async function POST(_req: Request, { params }: Props) {
  const { id } = await params;
  const supabase = await createAuthClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const welcomeToken = crypto.randomUUID();

  const { error } = await supabase
    .from("applications")
    .update({
      status: "files_released",
      files_released: true,
      files_released_at: new Date().toISOString(),
      welcome_token: welcomeToken,
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Email deferred to Phase 10
  return NextResponse.json({ success: true, welcome_token: welcomeToken });
}
