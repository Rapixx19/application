import type { RoleQuestion } from "@/lib/content/types";

interface StepRoleDetailsProps {
  selectedRoles: string[];
  roleQuestions: Record<string, RoleQuestion[]>;
  data: Record<string, Record<string, string>>;
  onChange: (role: string, field: string, value: string) => void;
}

export function StepRoleDetails({
  selectedRoles,
  roleQuestions,
  data,
  onChange,
}: StepRoleDetailsProps) {
  return (
    <div className="space-y-8">
      {selectedRoles.map((role) => {
        const questions = roleQuestions[role];
        if (!questions) return null;
        const roleData = data[role] || {};

        return (
          <div key={role}>
            <div className="text-xs text-muted uppercase tracking-wide mb-4">
              Showing questions for: <span className="font-medium text-primary">{role}</span>
            </div>
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.label}>
                  <label className="block text-sm font-medium text-primary mb-1.5">
                    {q.label} <span className="text-accent">*</span>
                  </label>
                  {q.type === "textarea" ? (
                    <textarea
                      value={roleData[q.label] || ""}
                      onChange={(e) => onChange(role, q.label, e.target.value)}
                      placeholder={q.placeholder}
                      rows={4}
                      className="w-full p-3.5 border border-border rounded-[10px] text-[0.95rem] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={roleData[q.label] || ""}
                      onChange={(e) => onChange(role, q.label, e.target.value)}
                      placeholder={q.placeholder}
                      className="w-full p-3.5 border border-border rounded-[10px] text-[0.95rem] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
