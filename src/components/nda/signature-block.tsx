"use client";

import { useState } from "react";

interface SignatureBlockProps {
  note: string;
  onSign: (name: string) => void;
  signing: boolean;
}

export function SignatureBlock({ note, onSign, signing }: SignatureBlockProps) {
  const [name, setName] = useState("");

  return (
    <div className="bg-card border border-border rounded-xl px-6 sm:px-8 py-6">
      <label className="block text-xs font-medium text-muted mb-3">
        Your full legal name
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type your name here"
        className="w-full p-4 border-0 border-b-2 border-primary font-serif italic text-2xl sm:text-3xl text-primary outline-none bg-transparent placeholder:text-muted/30"
      />
      <p className="text-[0.75rem] text-muted leading-relaxed mt-3">
        {note}
      </p>
      <button
        onClick={() => onSign(name)}
        disabled={!name.trim() || signing}
        className="w-full mt-6 p-3.5 bg-green text-white rounded-[10px] text-[0.95rem] font-medium transition-colors hover:bg-[#24774f] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {signing ? "Signing\u2026" : "Sign agreement \u2192"}
      </button>
    </div>
  );
}
