interface Field {
  label: string;
  value: string;
  isLink?: boolean;
}

export function DetailCards({ fields }: { fields: Field[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      {fields.map((f) => (
        <div key={f.label} className="bg-card border border-border rounded-xl p-5">
          <div className="text-[0.7rem] text-muted uppercase tracking-wide mb-1">
            {f.label}
          </div>
          {f.isLink && f.value ? (
            <a href={f.value} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline break-all">
              {f.value}
            </a>
          ) : (
            <div className="text-sm font-medium text-primary">{f.value || "\u2014"}</div>
          )}
        </div>
      ))}
    </div>
  );
}
