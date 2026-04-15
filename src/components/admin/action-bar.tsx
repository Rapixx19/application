"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SendNdaModal } from "./send-nda-modal";

interface ActionBarProps {
  applicationId: string;
  status: string;
  applicantName?: string;
  releaseScheduledAt?: string | null;
  filesReleased?: boolean;
}

export function ActionBar({
  applicationId,
  status,
  applicantName = "Applicant",
  releaseScheduledAt,
  filesReleased,
}: ActionBarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState("");
  const [showNdaModal, setShowNdaModal] = useState(false);
  const [countdown, setCountdown] = useState<string | null>(null);

  // Countdown timer for scheduled release
  useEffect(() => {
    if (!releaseScheduledAt || filesReleased) {
      setCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const releaseTime = new Date(releaseScheduledAt).getTime();
      const now = Date.now();
      const diff = releaseTime - now;

      if (diff <= 0) {
        setCountdown(null);
        router.refresh();
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCountdown(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [releaseScheduledAt, filesReleased, router]);

  const action = async (endpoint: string, method = "POST") => {
    setLoading(endpoint);
    await fetch(`/api/admin/applications/${applicationId}/${endpoint}`, { method });
    setLoading("");
    router.refresh();
  };

  const handleNdaSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-5 flex flex-wrap gap-3 mb-8 items-center">
        {status === "pending" && (
          <>
            <button
              onClick={() => setShowNdaModal(true)}
              disabled={!!loading}
              className="px-5 py-2.5 bg-green text-white text-sm font-medium rounded-lg hover:bg-[#24774f] disabled:opacity-40 transition-colors"
            >
              Send NDA
            </button>
            <button
              onClick={() => action("decline")}
              disabled={!!loading}
              className="px-5 py-2.5 text-red-600 border border-red-200 text-sm rounded-lg hover:bg-red-50 disabled:opacity-40 transition-colors"
            >
              {loading === "decline" ? "Declining..." : "Decline"}
            </button>
          </>
        )}

        {status === "nda_sent" && (
          <button
            onClick={() => setShowNdaModal(true)}
            disabled={!!loading}
            className="px-5 py-2.5 border border-border text-sm rounded-lg hover:border-muted disabled:opacity-40 transition-colors"
          >
            Resend NDA
          </button>
        )}

        {status === "nda_signed" && !filesReleased && (
          <>
            {countdown ? (
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="text-sm text-amber-700">
                    Files releasing in <span className="font-mono font-bold">{countdown}</span>
                  </span>
                </div>
                <button
                  onClick={() => action("release-files")}
                  disabled={!!loading}
                  className="px-5 py-2.5 bg-green text-white text-sm font-medium rounded-lg hover:bg-[#24774f] disabled:opacity-40 transition-colors"
                >
                  {loading === "release-files" ? "Releasing..." : "Release now"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => action("release-files")}
                disabled={!!loading}
                className="px-5 py-2.5 bg-green text-white text-sm font-medium rounded-lg hover:bg-[#24774f] disabled:opacity-40 transition-colors"
              >
                {loading === "release-files" ? "Releasing..." : "Release files"}
              </button>
            )}
          </>
        )}

        {status === "files_released" && (
          <span className="px-5 py-2.5 text-sm text-green font-medium">Files released</span>
        )}

        {status === "declined" && (
          <span className="px-5 py-2.5 text-sm text-muted">Application declined</span>
        )}
      </div>

      <SendNdaModal
        applicationId={applicationId}
        applicantName={applicantName}
        isOpen={showNdaModal}
        onClose={() => setShowNdaModal(false)}
        onSuccess={handleNdaSuccess}
      />
    </>
  );
}
