"use client";

import type { LandingContent } from "@/lib/content/types";

interface StepIntroProps {
  headline: string;
  subheadline: string;
  landing: LandingContent;
  onBegin: () => void;
}

export function StepIntro({ headline, subheadline, landing, onBegin }: StepIntroProps) {
  return (
    <div className="animate-[fadeIn_0.5s_ease]">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-block px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full text-[0.7rem] uppercase tracking-[0.2em] text-primary/70 mb-4">
          Open Application
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-3 leading-tight">
          {headline}
        </h1>
        <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
          {subheadline}
        </p>
      </div>

      {/* Roles Grid */}
      <div className="mb-8">
        <h3 className="text-[0.65rem] uppercase tracking-[0.2em] text-muted mb-4 text-center">
          Roles we&apos;re seeking
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {landing.roles.map((role, i) => (
            <div
              key={i}
              className="group relative p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all">
                {role.icon}
              </div>
              <h4 className="text-sm font-semibold text-primary mb-1">
                {role.title}
              </h4>
              <p className="text-[0.7rem] text-muted leading-relaxed line-clamp-2">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* What We Offer - Horizontal Pills */}
      <div className="mb-10">
        <h3 className="text-[0.65rem] uppercase tracking-[0.2em] text-muted mb-4 text-center">
          What you&apos;ll get
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {landing.offers.map((offer, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 hover:border-primary/30 transition-all"
            >
              <span className="text-base">{offer.icon}</span>
              <span className="text-xs font-medium text-primary">{offer.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex justify-center gap-8 mb-10 py-6 border-y border-border/50">
        {landing.stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-xl font-serif font-bold text-primary">
              {stat.value}
            </div>
            <div className="text-[0.65rem] uppercase tracking-wider text-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={onBegin}
          className="group relative px-10 py-4 bg-primary text-white rounded-xl text-sm font-medium transition-all hover:bg-[#2d3748] hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5"
        >
          <span className="flex items-center gap-2">
            Begin Application
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </button>
        <p className="text-[0.7rem] text-muted mt-3">
          Takes about 5 minutes to complete
        </p>
      </div>
    </div>
  );
}
