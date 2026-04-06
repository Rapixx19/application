"use client";

import Link from "next/link";
import { StatusBadge } from "./status-badge";
import { StarRating } from "./star-rating";

interface AIEvaluation {
  role_match_score: number;
  recommendation: "strong_yes" | "yes" | "maybe" | "no";
}

interface Application {
  id: string;
  full_name: string;
  email: string;
  roles: string[];
  country: string;
  admin_rating: number | null;
  created_at: string;
  status: string;
  ai_evaluation: AIEvaluation | null;
}

function AIScoreBadge({ evaluation }: { evaluation: AIEvaluation | null }) {
  if (!evaluation) {
    return <span className="text-xs text-muted">—</span>;
  }

  const score = evaluation.role_match_score;
  let color = "bg-red-100 text-red-700";
  if (score >= 80) color = "bg-emerald-100 text-emerald-700";
  else if (score >= 60) color = "bg-green-100 text-green-700";
  else if (score >= 40) color = "bg-amber-100 text-amber-700";

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {score}
    </span>
  );
}

export function ApplicationsTable({ applications }: { applications: Application[] }) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-background text-[0.75rem] uppercase text-muted font-semibold tracking-wide border-b border-border">
            <th className="text-left px-4 py-3">Name</th>
            <th className="text-left px-4 py-3 hidden md:table-cell">Role(s)</th>
            <th className="text-left px-4 py-3 hidden sm:table-cell">Country</th>
            <th className="text-left px-4 py-3 hidden lg:table-cell">AI Score</th>
            <th className="text-left px-4 py-3 hidden lg:table-cell">Rating</th>
            <th className="text-left px-4 py-3 hidden sm:table-cell">Applied</th>
            <th className="text-left px-4 py-3">Status</th>
            <th className="text-right px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-b border-border/50 hover:bg-background/50 transition-colors">
              <td className="px-4 py-3">
                <div className="font-medium text-primary">{app.full_name}</div>
                <div className="text-xs text-muted">{app.email}</div>
              </td>
              <td className="px-4 py-3 hidden md:table-cell text-xs text-muted">
                {app.roles?.join(", ") || "\u2014"}
              </td>
              <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted">
                {app.country || "\u2014"}
              </td>
              <td className="px-4 py-3 hidden lg:table-cell">
                <AIScoreBadge evaluation={app.ai_evaluation} />
              </td>
              <td className="px-4 py-3 hidden lg:table-cell">
                <StarRating value={app.admin_rating || 0} />
              </td>
              <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted">
                {fmt(app.created_at)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/applications/${app.id}`}
                  className="text-xs px-3 py-1.5 border border-border rounded-md hover:border-muted transition-colors"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
          {applications.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-muted text-sm">
                No applications yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
