"use client";

import { useState } from "react";
import type { AIEvaluation } from "@/lib/ai/types";

interface AIEvaluationCardProps {
  applicationId: string;
  evaluation: AIEvaluation | null;
}

const recommendationConfig: Record<string, { label: string; color: string; bg: string }> = {
  strong_yes: { label: "STRONG YES", color: "text-emerald-700", bg: "bg-emerald-100" },
  yes: { label: "YES", color: "text-green-700", bg: "bg-green-100" },
  maybe: { label: "MAYBE", color: "text-amber-700", bg: "bg-amber-100" },
  no: { label: "NO", color: "text-red-700", bg: "bg-red-100" },
};

function ScoreRing({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = "stroke-red-500";
  if (score >= 80) color = "stroke-emerald-500";
  else if (score >= 60) color = "stroke-green-500";
  else if (score >= 40) color = "stroke-amber-500";

  return (
    <div className="relative w-20 h-20">
      <svg className="w-20 h-20 -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-gray-200"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-primary">{score}</span>
        <span className="text-[0.65rem] text-muted">/100</span>
      </div>
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`text-sm ${i < rating ? "text-amber-400" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function AIEvaluationCard({ applicationId, evaluation }: AIEvaluationCardProps) {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEval, setCurrentEval] = useState<AIEvaluation | null>(evaluation);
  const [error, setError] = useState<string | null>(null);

  const runEvaluation = async () => {
    setIsEvaluating(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/evaluate`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Evaluation failed");
      }

      const data = await res.json();
      setCurrentEval(data.evaluation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed");
    } finally {
      setIsEvaluating(false);
    }
  };

  if (!currentEval) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[0.7rem] text-muted uppercase tracking-wide">AI Evaluation</div>
        </div>
        <div className="text-center py-8">
          <p className="text-muted text-sm mb-4">
            {error ? error : "No AI evaluation available yet"}
          </p>
          <button
            onClick={runEvaluation}
            disabled={isEvaluating}
            className="px-4 py-2 bg-primary text-white text-xs rounded-lg font-medium hover:bg-[#2d3748] disabled:opacity-40 transition-colors"
          >
            {isEvaluating ? "Evaluating..." : "Run AI Evaluation"}
          </button>
        </div>
      </div>
    );
  }

  const rec = recommendationConfig[currentEval.recommendation] || recommendationConfig.maybe;
  const evalDate = new Date(currentEval.generated_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[0.7rem] text-muted uppercase tracking-wide">AI Evaluation</div>
        <button
          onClick={runEvaluation}
          disabled={isEvaluating}
          className="text-xs text-muted hover:text-primary transition-colors disabled:opacity-40 flex items-center gap-1"
        >
          <span className={isEvaluating ? "animate-spin" : ""}>↻</span>
          {isEvaluating ? "Evaluating..." : "Re-evaluate"}
        </button>
      </div>

      {error && (
        <div className="text-red-600 text-xs mb-4 p-2 bg-red-50 rounded">{error}</div>
      )}

      {/* Header with score, rating, and recommendation */}
      <div className="flex items-start gap-6 mb-6">
        <ScoreRing score={currentEval.role_match_score} />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <StarDisplay rating={currentEval.overall_rating} />
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${rec.color} ${rec.bg}`}>
              {rec.label}
            </span>
          </div>
          <p className="text-sm text-primary leading-relaxed">{currentEval.summary}</p>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="text-[0.65rem] text-emerald-700 uppercase tracking-wide mb-2 font-medium">
            Strengths
          </div>
          <ul className="space-y-1.5">
            {currentEval.strengths.map((s, i) => (
              <li key={i} className="text-xs text-primary flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[0.65rem] text-amber-700 uppercase tracking-wide mb-2 font-medium">
            Areas to Probe
          </div>
          <ul className="space-y-1.5">
            {currentEval.weaknesses.map((w, i) => (
              <li key={i} className="text-xs text-primary flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">⚠</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Role Fit */}
      {Object.keys(currentEval.role_fit).length > 0 && (
        <div className="mb-6">
          <div className="text-[0.65rem] text-muted uppercase tracking-wide mb-2 font-medium">
            Role Fit
          </div>
          <div className="space-y-2">
            {Object.entries(currentEval.role_fit).map(([role, fit]) => (
              <div key={role} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-primary">{role}</span>
                    <span className="text-muted">{fit.score}/100</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        fit.score >= 80
                          ? "bg-emerald-500"
                          : fit.score >= 60
                          ? "bg-green-500"
                          : fit.score >= 40
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${fit.score}%` }}
                    />
                  </div>
                  <p className="text-[0.65rem] text-muted mt-1">{fit.reasoning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags */}
      {currentEval.red_flags.length > 0 && (
        <div className="mb-4">
          <div className="text-[0.65rem] text-red-700 uppercase tracking-wide mb-2 font-medium">
            Red Flags
          </div>
          <ul className="space-y-1.5">
            {currentEval.red_flags.map((flag, i) => (
              <li key={i} className="text-xs text-red-700 flex items-start gap-2">
                <span className="mt-0.5">🚩</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timestamp */}
      <div className="text-[0.6rem] text-muted pt-4 border-t border-border">
        Last evaluated: {evalDate}
      </div>
    </div>
  );
}
