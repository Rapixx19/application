"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email, password,
    });

    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin/applications");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-[#2d3748] flex items-center justify-center text-white text-lg font-serif mx-auto mb-3">
            S
          </div>
          <h1 className="font-serif text-2xl font-bold text-primary">Admin</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3.5 border border-border rounded-[10px] text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3.5 border border-border rounded-[10px] text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full p-3.5 bg-primary text-white rounded-[10px] text-sm font-medium hover:bg-[#2d3748] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Signing in\u2026" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
