interface Stat {
  label: string;
  value: number;
}

export function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-xl px-5 py-4"
        >
          <div className="text-xs text-muted mb-1">{stat.label}</div>
          <div className="text-3xl font-bold text-primary">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
