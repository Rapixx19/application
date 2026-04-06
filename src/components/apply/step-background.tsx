import type { RoleQuestion } from "@/lib/content/types";

interface StepBackgroundProps {
  data: { background: string; roles: string[]; role_details: Record<string, Record<string, string>> };
  backgrounds: string[];
  roleOptions: string[];
  roleQuestions: Record<string, RoleQuestion[]>;
  onChange: (field: string, value: string | string[]) => void;
  onRoleDetailChange: (role: string, field: string, value: string) => void;
}

export function StepBackground({ data, backgrounds, roleOptions, roleQuestions, onChange, onRoleDetailChange }: StepBackgroundProps) {
  const toggleRole = (role: string) => {
    const current = data.roles;
    const next = current.includes(role)
      ? current.filter((r) => r !== role)
      : [...current, role];
    onChange("roles", next);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Background <span className="text-accent">*</span>
        </label>
        <select
          value={data.background}
          onChange={(e) => onChange("background", e.target.value)}
          className="w-full p-3.5 border border-border rounded-[10px] text-[0.95rem] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors bg-white"
        >
          <option value="">Select your background</option>
          {backgrounds.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Role interest <span className="text-accent">*</span>
          <span className="text-muted font-normal text-xs ml-2">Select at least one</span>
        </label>
        <div className="flex flex-wrap gap-2 mt-2">
          {roleOptions.map((role) => {
            const selected = data.roles.includes(role);
            return (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                className={`px-4 py-2.5 rounded-full text-[0.85rem] border transition-colors ${
                  selected
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary border-border hover:border-muted"
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic role questions */}
      {data.roles.map((role) => {
        const questions = roleQuestions[role];
        if (!questions) return null;
        const roleData = data.role_details[role] || {};

        return (
          <fieldset key={role} className="border border-border rounded-[10px] p-4 mt-6">
            <legend className="text-xs text-muted uppercase tracking-wide px-2">
              {role}
            </legend>
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.label}>
                  <label className="block text-sm font-medium text-primary mb-1.5">
                    {q.label} <span className="text-accent">*</span>
                  </label>
                  {q.type === "textarea" ? (
                    <textarea
                      value={roleData[q.label] || ""}
                      onChange={(e) => onRoleDetailChange(role, q.label, e.target.value)}
                      placeholder={q.placeholder}
                      rows={4}
                      className="w-full p-3.5 border border-border rounded-[10px] text-[0.95rem] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={roleData[q.label] || ""}
                      onChange={(e) => onRoleDetailChange(role, q.label, e.target.value)}
                      placeholder={q.placeholder}
                      className="w-full p-3.5 border border-border rounded-[10px] text-[0.95rem] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors"
                    />
                  )}
                </div>
              ))}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
