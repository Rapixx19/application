import type { HeroContent } from "@/lib/content/types";
import Link from "next/link";

export function Hero({ hero }: { hero: HeroContent }) {
  return (
    <div>
      <span className="inline-block text-xs font-medium tracking-[0.15em] uppercase text-green">
        {hero.eyebrow}
      </span>

      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-primary leading-tight mt-4 whitespace-pre-line">
        {hero.headline}
      </h1>

      <p className="text-[#4a4a4a] text-base leading-7 mt-6">
        {hero.body}
      </p>

      <Link
        href={hero.cta_link}
        className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-primary text-white rounded-lg text-sm font-medium transition-colors hover:bg-[#2d3748]"
      >
        {hero.cta_text}
      </Link>
    </div>
  );
}
