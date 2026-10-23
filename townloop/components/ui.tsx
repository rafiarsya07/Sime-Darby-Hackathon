import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { BackIcon, ShopIcon } from "./Icons";
import { personPhoto } from "@/lib/photos";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

/** App pages read best at phone width; feeds widen on laptops. */
export function Page({ children, className = "", wide = false }: { children: ReactNode; className?: string; wide?: boolean }) {
  return (
    <div className={`mx-auto w-full px-4 pt-4 pb-28 sm:px-8 md:pt-8 md:pb-16 ${wide ? "max-w-6xl" : "max-w-2xl"} ${className}`}>
      {children}
    </div>
  );
}

type Variant = "primary" | "accent" | "secondary" | "quiet";
const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-[#333]",
  accent: "bg-ember text-white shadow-[0_6px_16px_-6px_rgba(242,107,46,0.6)] hover:bg-[#E35D20]",
  secondary: "border border-line-strong bg-white text-ink hover:border-ink",
  quiet: "text-ink hover:bg-surface",
};
const sizes = { md: "h-12 px-5 text-[16px]", sm: "h-10 px-4 text-[14px]", lg: "h-14 px-6 text-[17px]" };

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; size?: keyof typeof sizes }) {
  return (
    <button
      className={`press inline-flex items-center justify-center gap-2 rounded-[12px] font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    />
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; size?: keyof typeof sizes }) {
  return (
    <Link
      className={`press inline-flex items-center justify-center gap-2 rounded-[12px] font-semibold ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    />
  );
}

export function Avatar({ name, size = 40, vendor = false }: { name: string; size?: number; vendor?: boolean }) {
  const src = personPhoto(name, Math.max(96, size * 2));
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface font-semibold text-ink"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
      ) : vendor ? (
        <ShopIcon size={Math.round(size * 0.55)} />
      ) : (
        name.charAt(0)
      )}
    </span>
  );
}

/** Round back button used at the top of detail pages. */
export function BackButton({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <button onClick={onClick} aria-label="Back" className={`press flex size-10 items-center justify-center rounded-full bg-surface text-ink hover:bg-[#ECECE9] ${className}`}>
      <BackIcon size={20} />
    </button>
  );
}

/** Five stars, filled to the rounded rating. */
export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 1.8l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.7l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z"
            fill={n <= full ? "#F5A524" : "#E4E4E0"}
          />
        </svg>
      ))}
    </span>
  );
}

export function Dot({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`inline-block size-[7px] shrink-0 rounded-full bg-ember ${className}`} />;
}

export function Rating({ value, count, className = "", stars = false }: { value: number; count?: number; className?: string; stars?: boolean }) {
  if (!value) return <span className={`text-muted ${className}`}>New</span>;
  if (stars) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <Stars value={value} />
        {count !== undefined ? <span className="text-muted">({count})</span> : <span className="text-muted">{value.toFixed(1)}</span>}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.8l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.7l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z" fill="#F5A524" /></svg>
      {value.toFixed(1)}
      {count !== undefined ? <span className="text-muted">({count})</span> : null}
    </span>
  );
}

type BadgeKind = "verified" | "local" | "outside" | "facility" | "free" | "boost";
const BADGE: Record<BadgeKind, string> = {
  verified: "Verified resident",
  local: "Local vendor",
  outside: "Vetted vendor",
  facility: "SDP facility",
  free: "Free",
  boost: "Recommended",
};

export function Badge({ kind, className = "" }: { kind: BadgeKind; className?: string }) {
  const tone =
    kind === "verified"
      ? "bg-[#E7F6EC] text-[#17803D]"
      : kind === "local" || kind === "free"
        ? "bg-ember-wash text-ember-text"
        : kind === "boost"
          ? "bg-ink text-white"
          : "bg-surface text-ink-2";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${tone} ${className}`}>
      {kind === "verified" ? (
        <svg width="12" height="12" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="9" fill="#17A34A" />
          <path d="M6 10.2l2.6 2.6L14 7.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      {BADGE[kind]}
    </span>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mt-8 mb-2 flex items-baseline justify-between gap-4">
      <h2 className="text-[17px] font-semibold">{children}</h2>
      {action}
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="py-10 text-center">
      <p className="font-semibold">{title}</p>
      {children ? <div className="mt-1 text-[14px] text-muted">{children}</div> : null}
    </div>
  );
}

/** Grey stand in bar for actions the other person would take on their own phone. */
export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[10px] bg-surface px-3.5 py-3 text-[13px] text-ink-2">
      <span className="font-medium text-muted">Demo</span>
      {children}
    </div>
  );
}

export function TextField({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-[14px] font-medium">
        {label}
        {hint ? <span className="text-[12px] font-normal text-muted">{hint}</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-[13px] text-[#B42318]">{error}</span> : null}
    </label>
  );
}

export const inputClass = (bad?: string | boolean) =>
  `h-12 w-full rounded-[12px] border bg-white px-3.5 text-[15px] outline-none placeholder:text-muted focus:border-ink ${bad ? "border-[#B42318]" : "border-line-strong"}`;
