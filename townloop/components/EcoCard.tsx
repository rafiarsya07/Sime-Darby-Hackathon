import { Mark } from "./Logo";
import { fmtPoints, rm } from "@/lib/format";
import { POINTS_PER_RINGGIT } from "@/lib/points";

/**
 * The Eco points card: a bauhaus style member card in the brand colours.
 * Night on the left for the balance, colour blocks on the right.
 */
export function EcoCard({ name, points, since, next }: { name: string; points: number; since: string; next?: { title: string; cost: number } }) {
  const pct = next ? Math.min(100, (points / next.cost) * 100) : 100;
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-night text-white shadow-[0_18px_40px_-20px_rgba(21,23,28,0.7)]">
      {/* Colour blocks */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 grid w-[42%] grid-cols-2 grid-rows-3">
        <span className="bg-sun" />
        <span className="flex items-center justify-center bg-ember"><span className="size-[70%] rounded-full bg-[#FFB78F]" /></span>
        <span className="bg-leaf-wash"><span className="block size-full rounded-tl-full bg-leaf" /></span>
        <span className="flex items-center justify-center bg-white"><span className="size-[55%] rounded-full bg-night" /></span>
        <span className="bg-ember"><span className="block size-full rounded-br-full bg-sun" /></span>
        <span className="flex items-end justify-center bg-[#FFE7D6]"><span className="h-1/2 w-full rounded-t-full bg-ember" /></span>
      </div>
      <div className="relative w-[62%] p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white p-1.5"><Mark size={22} /></span>
          <span className="font-display text-[10px] font-semibold tracking-[0.08em] text-white/70 uppercase">Eco points</span>
        </div>
        <p className="mt-5 font-display text-[34px] leading-none font-bold tracking-[-0.05em] tabular-nums" data-testid="balance">{fmtPoints(points)}</p>
        <p className="mt-1.5 text-[12px] text-white/60">about {rm(Math.floor(points / POINTS_PER_RINGGIT))} to spend</p>
        {next ? (
          <div className="mt-4">
            <span className="block h-1.5 overflow-hidden rounded-full bg-white/15">
              <span className="block h-full rounded-full bg-sun" style={{ width: `${pct}%` }} />
            </span>
            <span className="mt-1.5 block text-[11px] leading-snug text-white/70">{fmtPoints(next.cost - points)} to {next.title}</span>
          </div>
        ) : null}
        <div className="mt-5 flex items-end justify-between gap-3">
          <span>
            <span className="block font-display text-[12px] font-semibold tracking-[0.04em] uppercase">{name}</span>
            <span className="block text-[11px] text-white/50">Member since {since}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
