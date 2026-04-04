import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  body?: string;
  body2?: string;
  children?: ReactNode;
}

export function Section({ title, body, body2, children }: SectionProps) {
  return (
    <section className="mt-16">
      <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
        {title}
      </h2>
      {body && (
        <p className="text-[0.95rem] leading-7 text-[#4a4a4a]">{body}</p>
      )}
      {body2 && (
        <p className="text-[0.95rem] leading-7 text-[#4a4a4a] mt-4">{body2}</p>
      )}
      {children}
    </section>
  );
}
