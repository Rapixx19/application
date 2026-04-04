"use client";

import { useState } from "react";
import { SignatureBlock } from "@/components/nda/signature-block";
import { SignedOverlay } from "@/components/nda/signed-overlay";

export function NdaSignClient({
  token,
  signatureNote,
}: {
  token: string;
  signatureNote: string;
}) {
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState("");

  const handleSign = async (name: string) => {
    setSigning(true);
    setError("");

    try {
      const res = await fetch("/api/nda/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, signed_name: name }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Something went wrong. Please try again.");
        setSigning(false);
        return;
      }

      setSigned(true);
    } catch {
      setError("Network error. Please try again.");
      setSigning(false);
    }
  };

  if (signed) return <SignedOverlay token={token} />;

  return (
    <>
      <SignatureBlock note={signatureNote} onSign={handleSign} signing={signing} />
      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
    </>
  );
}
