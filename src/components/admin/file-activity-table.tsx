interface Activity {
  file_name: string;
  opened_at: string;
  session_seconds: number;
}

function fmtTime(s: number): string {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m ${sec}s`;
}

export function FileActivityTable({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center text-muted text-sm">
        No file activity yet.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="text-[0.7rem] text-muted uppercase tracking-wide px-5 pt-5 pb-3">
        File activity
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[0.75rem] text-muted uppercase tracking-wide border-b border-border bg-background">
            <th className="text-left px-5 py-2">File</th>
            <th className="text-left px-5 py-2">Opened</th>
            <th className="text-left px-5 py-2">Time spent</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((a, i) => (
            <tr key={i} className="border-b border-border/50">
              <td className="px-5 py-3 font-medium text-primary">{a.file_name}</td>
              <td className="px-5 py-3 text-muted">
                {new Date(a.opened_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </td>
              <td className="px-5 py-3 text-muted">{fmtTime(a.session_seconds)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
