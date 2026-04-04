"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ActionBarProps {
  applicationId: string;
  status: string;
}

export function ActionBar({ applicationId, status }: ActionBarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState("");

  const action = async (endpoint: string, method = "POST") => {
    setLoading(endpoint);
    await fetch(`/api/admin/applications/${applicationId}/${endpoint}`, { method });
    setLoading("");
    router.refresh();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-wrap gap-3 mb-8">
      {(status === "pending") && (
        <>
          <button onClick={() => action("send-nda")} disabled={!!loading}
            className="px-5 py-2.5 bg-green text-white text-sm font-medium rounded-lg hover:bg-[#24774f] disabled:opacity-40 transition-colors">
            {loading === "send-nda" ? "Sending\u2026" : "Send NDA \u2192"}
          </button>
          <button onClick={() => action("decline")} disabled={!!loading}
            className="px-5 py-2.5 text-red-600 border border-red-200 text-sm rounded-lg hover:bg-red-50 disabled:opacity-40 transition-colors">
            {loading === "decline" ? "Declining\u2026" : "Decline"}
          </button>
        </>
      )}
      {status === "nda_sent" && (
        <button onClick={() => action("send-nda")} disabled={!!loading}
          className="px-5 py-2.5 border border-border text-sm rounded-lg hover:border-muted disabled:opacity-40 transition-colors">
          {loading === "send-nda" ? "Resending\u2026" : "Resend NDA"}
        </button>
      )}
      {status === "nda_signed" && (
        <button onClick={() => action("release-files")} disabled={!!loading}
          className="px-5 py-2.5 bg-green text-white text-sm font-medium rounded-lg hover:bg-[#24774f] disabled:opacity-40 transition-colors">
          {loading === "release-files" ? "Releasing\u2026" : "Release files"}
        </button>
      )}
      {status === "files_released" && (
        <span className="px-5 py-2.5 text-sm text-green font-medium">Files released</span>
      )}
      {status === "declined" && (
        <span className="px-5 py-2.5 text-sm text-muted">Application declined</span>
      )}
    </div>
  );
}
