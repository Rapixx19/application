import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  body?: string;
  bullets?: string[];
  body2?: string;
  children?: ReactNode;
}

export function Section({ title, body, bullets, body2, children }: SectionProps) {
  return (
    <section className="mt-16">
      <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
        {title}
      </h2>
      {body && (
        <p className="text-[0.95rem] leading-7 text-[#4a4a4a]">{body}</p>
      )}
      {bullets && bullets.length > 0 && (
        <ul className="mt-4 space-y-2">
          {bullets.map((item, i) => (
            <li key={i} className="flex gap-3 text-[0.95rem] leading-7 text-[#4a4a4a]">
              <span className="text-green mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {body2 && (
        <p className="text-[0.95rem] leading-7 text-[#4a4a4a] mt-4">{body2}</p>
      )}
      {children}
    </section>
  );
}
