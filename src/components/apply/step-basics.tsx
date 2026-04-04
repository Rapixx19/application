interface StepBasicsProps {
  data: { full_name: string; email: string };
  onChange: (field: string, value: string) => void;
}

export function StepBasics({ data, onChange }: StepBasicsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Full name <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          value={data.full_name}
          onChange={(e) => onChange("full_name", e.target.value)}
          placeholder="Your full name"
          className="w-full p-3.5 border border-border rounded-[10px] text-[0.95rem] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Email <span className="text-accent">*</span>
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="you@example.com"
          className="w-full p-3.5 border border-border rounded-[10px] text-[0.95rem] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors"
        />
      </div>
    </div>
  );
}
