export function StarRating({
  value,
  max = 5,
  onChange,
}: {
  value: number;
  max?: number;
  onChange?: (v: number) => void;
}) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < value;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange?.(i + 1)}
            disabled={!onChange}
            className={`w-6 h-6 text-sm ${filled ? "text-amber-400" : "text-gray-300"} ${onChange ? "cursor-pointer hover:text-amber-300" : "cursor-default"}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
