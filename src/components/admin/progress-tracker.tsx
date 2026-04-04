const STEPS = [
  { key: "pending", label: "Submitted" },
  { key: "pending", label: "Under review" },
  { key: "nda_sent", label: "NDA sent" },
  { key: "nda_signed", label: "NDA signed" },
  { key: "files_released", label: "Files released" },
];

const ORDER = ["pending", "nda_sent", "nda_signed", "files_released"];

function getActiveIndex(status: string): number {
  if (status === "declined") return -1;
  if (status === "pending") return 1;
  const idx = ORDER.indexOf(status);
  return idx === -1 ? 0 : idx + 1;
}

export function ProgressTracker({ status }: { status: string }) {
  const activeIdx = getActiveIndex(status);

  return (
    <div className="flex items-center mb-8">
      {STEPS.map((step, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-full border-2 ${
                done ? "bg-green border-green" : active ? "bg-primary border-primary" : "bg-white border-gray-300"
              }`} />
              <span className={`text-[0.65rem] whitespace-nowrap ${
                done ? "text-green" : active ? "text-primary font-semibold" : "text-muted/50"
              }`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 ${done ? "bg-green" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
