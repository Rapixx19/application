"use client";

import { useState } from "react";
import { StatusResult } from "./status-result";

interface AppStatus {
  full_name: string;
  status: string;
  created_at: string;
}

export function StatusLookup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AppStatus | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const lookup = async () => {
    if (!email.includes("@")) return;
    setLoading(true);
    setError("");
    setResult(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/status?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      if (res.status === 404) {
        setError("No application found with that email.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Lookup form */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <label className="block text-xs font-medium text-muted mb-2">
          Email address
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            placeholder="you@example.com"
            className="flex-1 p-3 border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors"
          />
          <button
            onClick={lookup}
            disabled={!email.includes("@") || loading}
            className="px-5 py-3 bg-primary text-white rounded-lg text-sm font-medium transition-colors hover:bg-[#2d3748] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Looking up\u2026" : "Look up"}
          </button>
        </div>
      </div>

      {error && searched && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}

      {result && <StatusResult data={result} />}
    </div>
  );
}
