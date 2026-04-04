import type { RoleCard } from "@/lib/content/types";

export function RoleCards({ roles }: { roles: RoleCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {roles.map((role) => (
        <div
          key={role.title}
          className="p-5 border border-border rounded-xl bg-card"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-primary">
              {role.title}
            </h3>
            <span className="text-[0.65rem] px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-medium">
              Required
            </span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            {role.description}
          </p>
        </div>
      ))}
    </div>
  );
}
