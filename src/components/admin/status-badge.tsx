const STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending:        { bg: "bg-amber-100",  text: "text-amber-800",  label: "Pending review" },
  nda_sent:       { bg: "bg-blue-100",   text: "text-blue-800",   label: "NDA sent" },
  nda_signed:     { bg: "bg-teal-100",   text: "text-teal-800",   label: "NDA signed" },
  files_released: { bg: "bg-green-100",  text: "text-green-800",  label: "Files released" },
  declined:       { bg: "bg-gray-100",   text: "text-gray-600",   label: "Declined" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STYLES[status] || STYLES.pending;
  return (
    <span className={`inline-block text-[0.7rem] font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}
