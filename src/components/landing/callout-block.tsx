import type { CalloutContent } from "@/lib/content/types";

export function CalloutBlock({ callout }: { callout: CalloutContent }) {
  return (
    <div className="border-l-[3px] border-green bg-green/5 rounded-r-lg p-5 mt-6">
      <div className="text-[0.7rem] tracking-[0.1em] uppercase text-green font-semibold mb-2">
        {callout.tag}
      </div>
      <p className="text-[#4a4a4a] text-sm leading-relaxed">
        {callout.text}
      </p>
    </div>
  );
}
