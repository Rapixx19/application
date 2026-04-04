export function ProgressBar({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="flex gap-1.5 mb-12">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        let color = "bg-border";
        if (step < currentStep) color = "bg-green";
        if (step === currentStep) color = "bg-primary";
        return (
          <div
            key={step}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${color}`}
          />
        );
      })}
    </div>
  );
}
