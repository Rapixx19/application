"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface SplashOverlayProps {
  wordmark: string;
  tagline: string;
  duration: number;
  logoPath?: string;
  videoUrl?: string;
  musicUrl?: string;
  musicVolume?: number;
}

export function SplashOverlay({
  wordmark,
  tagline,
  duration,
  logoPath,
  videoUrl,
  musicUrl,
  musicVolume = 0.5,
}: SplashOverlayProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const dismiss = useCallback(() => {
    if (fading) return;
    setFading(true);
    // Fade out audio
    if (audioRef.current) {
      const fadeOut = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.05) {
          audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.05);
        } else {
          clearInterval(fadeOut);
          if (audioRef.current) {
            audioRef.current.pause();
          }
        }
      }, 50);
    }
    setTimeout(() => setVisible(false), 800);
  }, [fading]);

  useEffect(() => {
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, dismiss]);

  // Handle user interaction to enable audio
  const handleInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      if (audioRef.current && musicUrl) {
        audioRef.current.volume = musicVolume;
        audioRef.current.play().catch(() => {});
      }
    }
  };

  // Try to autoplay audio on mount
  useEffect(() => {
    if (audioRef.current && musicUrl) {
      audioRef.current.volume = musicVolume;
      audioRef.current.play().catch(() => {
        // Autoplay blocked, will play on interaction
      });
    }
  }, [musicUrl, musicVolume]);

  if (!visible) return null;

  const r = 16;
  const circumference = 2 * Math.PI * r;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-800 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleInteraction}
      onKeyDown={handleInteraction}
      role="button"
      tabIndex={0}
    >
      {/* Video Background */}
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
          }}
        />
      )}

      {/* Dark overlay for video */}
      {videoUrl && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Background Music */}
      {musicUrl && (
        <audio ref={audioRef} loop preload="auto">
          <source src={musicUrl} type="audio/mpeg" />
        </audio>
      )}

      {/* Logo or Wordmark */}
      {logoPath ? (
        <div className="relative z-10 w-32 h-32 sm:w-48 sm:h-48 animate-fade-up-delay-1">
          <Image
            src={logoPath}
            alt={wordmark}
            fill
            className="object-contain"
            priority
          />
        </div>
      ) : (
        <div className="relative z-10 font-serif text-4xl sm:text-6xl font-bold text-white tracking-[0.15em] uppercase animate-fade-up-delay-1">
          {wordmark}
        </div>
      )}

      {/* Tagline */}
      <div className="relative z-10 text-white/40 text-xs sm:text-sm tracking-[0.3em] uppercase mt-4 animate-fade-up-delay-2">
        {tagline}
      </div>

      {/* Enter button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleInteraction();
          dismiss();
        }}
        className="relative z-10 mt-12 px-10 py-3 border border-white/20 rounded-full text-white/60 text-xs tracking-[0.2em] uppercase cursor-pointer transition-all hover:border-white/50 hover:text-white animate-fade-up-delay-3"
      >
        Enter
      </button>

      {/* Click to enable audio hint */}
      {musicUrl && !userInteracted && (
        <div className="relative z-10 mt-4 text-white/30 text-[0.65rem] tracking-wider animate-fade-up-delay-3">
          Click anywhere to enable audio
        </div>
      )}

      {/* Countdown circle */}
      <div className="absolute bottom-8 z-10">
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
