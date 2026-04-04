export function MotivationQuote({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="text-[0.7rem] text-muted uppercase tracking-wide mb-3">Motivation</div>
      <blockquote className="font-serif italic text-base text-[#444] leading-7">
        &ldquo;{text}&rdquo;
      </blockquote>
    </div>
  );
}
