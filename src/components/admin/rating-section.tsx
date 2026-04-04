"use client";

import { useState } from "react";
import { StarRating } from "./star-rating";

interface RatingSectionProps {
  applicationId: string;
  initialRating: number;
  initialNotes: string;
}

export function RatingSection({ applicationId, initialRating, initialNotes }: RatingSectionProps) {
  const [rating, setRating] = useState(initialRating);
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/admin/applications/${applicationId}/rating`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_rating: rating, admin_notes: notes }),
    });
    setSaving(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="text-[0.7rem] text-muted uppercase tracking-wide mb-3">Your assessment</div>
      <StarRating value={rating} onChange={setRating} />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes about this applicant..."
        className="w-full mt-4 p-3 border border-border rounded-lg text-sm min-h-[80px] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none"
      />
      <button
        onClick={save}
        disabled={saving}
        className="mt-3 px-4 py-2 bg-primary text-white text-xs rounded-lg font-medium hover:bg-[#2d3748] disabled:opacity-40 transition-colors"
      >
        {saving ? "Saving\u2026" : "Save assessment"}
      </button>
    </div>
  );
}
