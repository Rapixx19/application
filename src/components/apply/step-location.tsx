interface StepLocationProps {
  data: { country: string; institution: string };
  countries: string[];
  onChange: (field: string, value: string) => void;
}

export function StepLocation({ data, countries, onChange }: StepLocationProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Country <span className="text-accent">*</span>
        </label>
        <select
          value={data.country}
          onChange={(e) => onChange("country", e.target.value)}
          className="w-full p-3.5 border border-border rounded-[10px] text-[0.95rem] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors bg-white"
        >
          <option value="">Select your country</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Institution or employer <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          value={data.institution}
          onChange={(e) => onChange("institution", e.target.value)}
          placeholder="University, company, or independent"
          className="w-full p-3.5 border border-border rounded-[10px] text-[0.95rem] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors"
        />
      </div>
    </div>
  );
}
