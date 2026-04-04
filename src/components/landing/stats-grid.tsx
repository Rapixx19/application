import type { StatCard } from "@/lib/content/types";

export function StatsGrid({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-6 border border-border rounded-xl bg-card text-center"
        >
          <div className="font-serif text-2xl font-bold text-primary">
            {stat.value}
          </div>
          <div className="text-xs text-muted mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
