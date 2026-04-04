interface StepMotivationProps {
  data: { portfolio_url: string; motivation: string };
  onChange: (field: string, value: string) => void;
}

export function StepMotivation({ data, onChange }: StepMotivationProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Portfolio or LinkedIn URL
        </label>
        <input
          type="url"
          value={data.portfolio_url}
          onChange={(e) => onChange("portfolio_url", e.target.value)}
          placeholder="https://..."
          className="w-full p-3.5 border border-border rounded-[10px] text-[0.95rem] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Why this project? <span className="text-accent">*</span>
        </label>
        <textarea
          value={data.motivation}
          onChange={(e) => onChange("motivation", e.target.value)}
          placeholder="What about Sentavita interests you, and what can you bring to this collaboration?"
          rows={5}
          className="w-full p-3.5 border border-border rounded-[10px] text-[0.95rem] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors resize-none"
        />
      </div>
    </div>
  );
}
