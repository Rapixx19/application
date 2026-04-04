export function NdaTextBox({ text }: { text: string }) {
  const paragraphs = text.split("\n\n");

  return (
    <div className="bg-card border border-border rounded-xl p-6 sm:p-8 max-h-[400px] overflow-y-auto mb-8">
      {paragraphs.map((para, i) => {
        const isHeading = /^\d+\.\s/.test(para) || para === "Non-Disclosure Agreement";
        if (isHeading) {
          return (
            <h3 key={i} className="text-base font-semibold text-primary mt-6 first:mt-0 mb-2">
              {para}
            </h3>
          );
        }
        return (
          <p key={i} className="text-[0.85rem] text-[#444] leading-7 mb-3 whitespace-pre-line">
            {para}
          </p>
        );
      })}
      <p className="text-xs italic text-muted mt-4">
        Scroll to read all 12 clauses...
      </p>
    </div>
  );
}
