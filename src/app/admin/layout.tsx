import { createAuthClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let email = "";
  try {
    const supabase = await createAuthClient();
    const { data: { user } } = await supabase.auth.getUser();
    email = user?.email || "";
  } catch {}

  // Login page — no sidebar
  if (!email) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar email={email} />
      <main className="flex-1 bg-[#f5f5f5] p-6 sm:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
