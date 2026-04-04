import type { OfferCard } from "@/lib/content/types";

export function OfferCards({ offers }: { offers: OfferCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {offers.map((offer) => (
        <div
          key={offer.title}
          className="p-5 border border-border rounded-xl bg-card"
        >
          <h3 className="text-sm font-semibold text-primary">
            {offer.title}
          </h3>
          <p className="text-xs text-muted leading-relaxed mt-1">
            {offer.description}
          </p>
        </div>
      ))}
    </div>
  );
}
