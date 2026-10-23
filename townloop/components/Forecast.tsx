import { ForecastIcon } from "./Icons";

/**
 * Placeholder for the demand forecasting model from the spec
 * (scikit-learn on weather, season and precinct phase). Static for now;
 * the numbers are illustrative and labelled as a preview.
 */
export function ForecastCard({ compact = false, topic = "Aircond servicing" }: { compact?: boolean; topic?: string }) {
  const bars = [32, 38, 35, 44, 58, 76, 92, 88];
  return (
    <section aria-label="Demand forecast preview" className="rounded-[12px] border border-line p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[13px] font-semibold">
          <ForecastIcon size={18} /> Demand forecast
        </span>
        <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted">AI preview, not live yet</span>
      </div>
      <p className="mt-2 text-[15px] leading-snug font-semibold">{topic} in Elmina Valley is likely to double in the next two weeks.</p>
      {!compact ? (
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          A hot, dry spell is forecast. Book early or join a street group before slots fill up.
        </p>
      ) : null}
      <div className="mt-3 flex h-14 items-end gap-1.5" aria-hidden="true">
        {bars.map((h, i) => (
          <span key={i} className={`flex-1 rounded-t-[3px] ${i >= 5 ? "bg-ember" : "bg-[#E4E4E1]"}`} style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-muted" aria-hidden="true">
        <span>Last 5 weeks</span>
        <span>Next 3 weeks</span>
      </div>
    </section>
  );
}
