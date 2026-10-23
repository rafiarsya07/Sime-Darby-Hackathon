import Link from "next/link";

/** Two linked rings: you and your neighbour. Pass the background so the overlap break matches. */
export function Mark({ size = 30, background = "#FFFFFF" }: { size?: number; background?: string }) {
  return (
    <svg width={size} height={(size * 2) / 3} viewBox="0 0 120 80" aria-hidden="true">
      <circle cx="40" cy="40" r="25" fill="none" stroke="#1A1A1A" strokeWidth="10" />
      <circle cx="80" cy="40" r="25" fill="none" stroke="#F26B2E" strokeWidth="10" />
      <path d="M64 48.5 A25 25 0 0 1 53 61.5" fill="none" stroke={background} strokeWidth="18" />
      <path d="M64 48.5 A25 25 0 0 1 53 61.5" fill="none" stroke="#1A1A1A" strokeWidth="10" />
    </svg>
  );
}

export function Logo({ href = "/", size = 30 }: { href?: string; size?: number }) {
  return (
    <Link href={href} aria-label="TownLoop home" className="flex items-center gap-2 text-ink">
      <Mark size={size} />
      <span className="font-display text-[19px] font-semibold tracking-[-0.02em]">townloop</span>
    </Link>
  );
}
