const PIPELINE = [
  { key: "pending", label: "Submitted" },
  { key: "pending", label: "Under review" },
  { key: "nda_sent", label: "NDA sent" },
  { key: "nda_signed", label: "NDA signed" },
  { key: "files_released", label: "Files released" },
];

const STATUS_ORDER = ["pending", "nda_sent", "nda_signed", "files_released"];

const BADGE_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  pending: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500", label: "Under review" },
  nda_sent: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500", label: "NDA sent" },
  nda_signed: { bg: "bg-teal-100", text: "text-teal-800", dot: "bg-teal-500", label: "NDA signed" },
  files_released: { bg: "bg-green/10", text: "text-green", dot: "bg-green", label: "Files released" },
  declined: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400", label: "Declined" },
};

function getActiveIndex(status: string): number {
  const idx = STATUS_ORDER.indexOf(status);
  if (status === "pending") return 1;
  if (idx === -1) return 0;
  return idx + 1;
}

interface StatusResultProps {
  data: { full_name: string; status: string; created_at: string };
}

export function StatusResult({ data }: StatusResultProps) {
  const activeIdx = getActiveIndex(data.status);
  const badge = BADGE_STYLES[data.status] || BADGE_STYLES.pending;
  const applied = new Date(data.created_at).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="font-serif text-xl font-semibold text-primary">{data.full_name}</div>
      <div className="text-xs text-muted mt-1 mb-6">Applied {applied}</div>

      {/* Progress pipeline */}
      <div className="flex items-center mb-6">
        {PIPELINE.map((step, i) => {
          const done = i < activeIdx;
          const active = i === activeIdx;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-3 h-3 rounded-full border-2 ${
                    done ? "bg-green border-green" : active ? "bg-primary border-primary" : "bg-white border-border"
                  }`}
                />
                <span
                  className={`text-[0.65rem] whitespace-nowrap ${
                    done ? "text-green" : active ? "text-primary font-semibold" : "text-muted/50"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < PIPELINE.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1.5 mb-5 hidden sm:block ${done ? "bg-green" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <span className={`w-2 h-2 rounded-full animate-pulse ${badge.dot}`} />
        {badge.label}
      </div>

      {/* Note */}
      <p className="text-xs text-muted leading-relaxed mt-5 pt-5 border-t border-border">
        Your application is being reviewed by the founding team. You&apos;ll receive an email when the next step is ready. This typically takes 5&ndash;10 business days.
      </p>
    </div>
  );
}
