import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ShopIcon, StarIcon, VerifiedIcon } from "./Icons";

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

type Variant = "primary" | "secondary" | "quiet";
const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-[#333]",
  secondary: "border border-line-strong bg-white text-ink hover:border-ink",
  quiet: "text-ink hover:bg-surface",
};
const sizes = { md: "h-12 px-5 text-[16px]", sm: "h-10 px-4 text-[14px]" };

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; size?: keyof typeof sizes }) {
  return (
    <button
      className={`press inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
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
      className={`press inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    />
  );
}

export function Avatar({ name, size = 40, vendor = false }: { name: string; size?: number; vendor?: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={`inline-flex shrink-0 items-center justify-center font-semibold text-ink ${vendor ? "rounded-[10px] bg-[#EFEFEC]" : "rounded-full bg-surface"}`}
    >
      {vendor ? <ShopIcon size={Math.round(size * 0.55)} /> : name.charAt(0)}
    </span>
  );
}

export function Dot({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`inline-block size-[7px] shrink-0 rounded-full bg-ember ${className}`} />;
}

export function Rating({ value, count, className = "" }: { value: number; count?: number; className?: string }) {
  if (!value) return <span className={`text-muted ${className}`}>New</span>;
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <StarIcon size={13} />
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
    kind === "local" || kind === "free"
      ? "bg-ember-wash text-ember-text"
      : kind === "boost"
        ? "bg-ink text-white"
        : "bg-surface text-ink-2";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${tone} ${className}`}>
      {kind === "verified" ? <VerifiedIcon size={12} /> : null}
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
  `h-12 w-full rounded-[10px] border bg-white px-3.5 text-[15px] outline-none placeholder:text-muted focus:border-ink ${bad ? "border-[#B42318]" : "border-line-strong"}`;
