"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function SignedOverlay({ token }: { token: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/welcome/${token}`);
    }, 2500);
    return () => clearTimeout(timer);
  }, [router, token]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95">
      {/* Checkmark circle */}
      <div className="w-20 h-20 rounded-full bg-green flex items-center justify-center animate-[scaleIn_0.5s_ease]">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 className="font-serif text-2xl font-semibold text-primary mt-6 animate-fade-up-delay-1">
        Agreement recorded
      </h2>
      <p className="text-sm text-muted mt-2 animate-fade-up-delay-2">
        Redirecting to your project folder...
      </p>
    </div>
  );
}
