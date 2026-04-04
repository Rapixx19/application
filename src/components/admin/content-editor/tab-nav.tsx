"use client";

const TABS = [
  { key: "splash", label: "Splash" },
  { key: "landing", label: "Landing" },
  { key: "apply", label: "Apply" },
  { key: "submitted", label: "Submitted" },
  { key: "status", label: "Status" },
  { key: "nda", label: "NDA" },
  { key: "welcome", label: "Welcome" },
  { key: "branding", label: "Branding" },
];

export function TabNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border mb-8 pb-px">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2.5 text-sm whitespace-nowrap rounded-t-lg transition-colors ${
            active === tab.key
              ? "bg-card border border-b-0 border-border text-primary font-medium -mb-px"
              : "text-muted hover:text-primary"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
