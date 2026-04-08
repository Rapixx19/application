"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ApplyContent, LandingContent } from "@/lib/content/types";
import { trackEvent } from "@/lib/analytics";
import { ProgressBar } from "./progress-bar";
import { StepIntro } from "./step-intro";
import { StepBasics } from "./step-basics";
import { StepLocation } from "./step-location";
import { StepBackground } from "./step-background";
import { StepMotivation } from "./step-motivation";

const KEY = "sentavita_apply";
type FD = { full_name: string; email: string; country: string; institution: string; background: string; roles: string[]; role_details: Record<string, Record<string, string>>; portfolio_url: string; motivation: string };
const empty: FD = { full_name: "", email: "", country: "", institution: "", background: "", roles: [], role_details: {}, portfolio_url: "", motivation: "" };

export function SteppedForm({ content, landing }: { content: ApplyContent; landing: LandingContent }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FD>(empty);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const cvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(KEY);
    if (saved) {
      try { setData(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  const set = (field: string, value: string | string[]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const setRoleDetail = (role: string, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      role_details: { ...prev.role_details, [role]: { ...prev.role_details[role], [field]: value } },
    }));
  };

  const canContinue = () => {
    if (step === 1) return data.full_name.trim() && data.email.includes("@");
    if (step === 2) return data.country && data.institution.trim();
    if (step === 3) {
      // Background, at least one role, and all role questions filled
      if (!data.background || data.roles.length === 0) return false;
      return data.roles.every((role) => {
        const qs = content.role_questions[role] || [];
        const rd = data.role_details[role] || {};
        return qs.every((q) => (rd[q.label] || "").trim());
      });
    }
    if (step === 4) return data.motivation.trim();
    return false;
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (cvFile) {
        formData.append("cv", cvFile);
      }

      const res = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      sessionStorage.removeItem(KEY);
      trackEvent("application_submitted", { roles: data.roles });
      router.push("/submitted");
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  // Step 0 is intro, steps 1-4 are form steps
  const isIntro = step === 0;
  const stepInfo = !isIntro ? content.steps[step - 1] : null;
  const isLast = step === 4;

  // Show intro page
  if (isIntro) {
    return (
      <div className="pt-8">
        <StepIntro
          headline={content.headline}
          subheadline={content.subheadline}
          landing={landing}
          onBegin={() => setStep(1)}
        />
      </div>
    );
  }

  // Show form steps
  return (
    <div>
      <ProgressBar currentStep={step} totalSteps={4} />

      <div className="text-[0.7rem] uppercase tracking-[0.15em] text-muted mb-2">
        Step {step} of 4
      </div>
      <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-primary mb-1">
        {stepInfo?.title}
      </h2>
      <p className="text-sm text-muted mb-8">{stepInfo?.description}</p>

      <div key={step} className="animate-[slideIn_0.4s_ease]">
        {step === 1 && <StepBasics data={data} onChange={set} />}
        {step === 2 && <StepLocation data={data} countries={content.countries} onChange={set} />}
        {step === 3 && (
          <StepBackground
            data={data}
            backgrounds={content.backgrounds}
            roleOptions={content.role_options}
            roleQuestions={content.role_questions}
            onChange={set}
            onRoleDetailChange={setRoleDetail}
          />
        )}
        {step === 4 && (
          <StepMotivation
            data={data}
            onChange={set}
            cvFile={cvFile}
            onCvChange={setCvFile}
            cvInputRef={cvInputRef}
          />
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-4">{error}</p>
      )}

      <div className="flex justify-between mt-10">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 border border-border rounded-[10px] text-sm text-muted transition-colors hover:border-muted"
          >
            Back
          </button>
        ) : <div />}

        {isLast ? (
          <button
            type="button"
            onClick={submit}
            disabled={!canContinue() || submitting}
            className="px-6 py-3 bg-green text-white rounded-[10px] text-sm font-medium transition-colors hover:bg-[#24774f] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting\u2026" : "Submit application"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!canContinue()}
            className="px-6 py-3 bg-primary text-white rounded-[10px] text-sm font-medium transition-colors hover:bg-[#2d3748] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
