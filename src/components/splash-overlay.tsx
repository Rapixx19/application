"use client";

import { useState, useEffect, useCallback } from "react";

interface SplashOverlayProps {
  wordmark: string;
  tagline: string;
  duration: number;
}

export function SplashOverlay({ wordmark, tagline, duration }: SplashOverlayProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  const dismiss = useCallback(() => {
    if (fading) return;
    setFading(true);
    setTimeout(() => setVisible(false), 800);
  }, [fading]);

  useEffect(() => {
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, dismiss]);

  if (!visible) return null;

  const r = 16;
  const circumference = 2 * Math.PI * r;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-800 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
      }}
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Wordmark */}
      <div className="font-serif text-4xl sm:text-6xl font-bold text-white tracking-[0.15em] uppercase animate-fade-up-delay-1">
        {wordmark}
      </div>

      {/* Tagline */}
      <div className="text-white/40 text-xs sm:text-sm tracking-[0.3em] uppercase mt-4 animate-fade-up-delay-2">
        {tagline}
      </div>

      {/* Enter button */}
      <button
        onClick={dismiss}
        className="mt-12 px-10 py-3 border border-white/20 rounded-full text-white/60 text-xs tracking-[0.2em] uppercase cursor-pointer transition-all hover:border-white/50 hover:text-white animate-fade-up-delay-3"
      >
        Enter
      </button>

      {/* Countdown circle */}
      <div className="absolute bottom-8">
        <svg width="40" height="40" className="-rotate-90">
          <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
          <circle
            cx="20"
            cy="20"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ animation: `countdown ${duration / 1000}s linear forwards` }}
          />
        </svg>
      </div>
    </div>
  );
}
