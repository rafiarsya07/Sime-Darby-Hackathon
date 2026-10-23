import { ForecastIcon } from "./Icons";

/**
 * Placeholder for the demand forecasting model from the spec
 * (scikit-learn on weather, season and precinct phase). Static for now;
 * the numbers are illustrative and labelled as a preview.
 */
export function ForecastCard({ compact = false, topic = "Aircond servicing" }: { compact?: boolean; topic?: string }) {
  const bars = [32, 38, 35, 44, 58, 76, 92, 88];
  return (
    <section aria-label="Demand forecast preview" className="relative overflow-hidden rounded-[24px] bg-night p-4 text-white">
      <span aria-hidden="true" className="pointer-events-none absolute -top-16 -right-10 size-44 rounded-full bg-ember/25 blur-2xl" />
      <div className="relative flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 font-display text-[11px] font-semibold tracking-[0.03em] uppercase">
          <span className="flex size-8 items-center justify-center rounded-full bg-white/10"><ForecastIcon size={17} /></span>
          Demand forecast
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-white/80">
          <span className="size-1.5 rounded-full bg-sun" /> AI preview, not live
        </span>
      </div>
      <p className="relative mt-3 text-[16px] leading-snug font-semibold">{topic} in Elmina Valley is likely to double in the next two weeks.</p>
      {!compact ? (
        <p className="relative mt-1 text-[13px] leading-relaxed text-white/60">
          A hot, dry spell is forecast. Book early or join a street group before slots fill up.
        </p>
      ) : null}
      <div className="relative mt-4 flex h-16 items-end gap-1.5" aria-hidden="true">
        {bars.map((h, i) => (
          <span key={i} className={`flex-1 rounded-[6px] ${i >= 5 ? "bg-ember" : "bg-white/15"}`} style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="relative mt-1.5 flex justify-between text-[11px] text-white/50" aria-hidden="true">
        <span>Last 5 weeks</span>
        <span>Next 3 weeks</span>
      </div>
    </section>
  );
}
