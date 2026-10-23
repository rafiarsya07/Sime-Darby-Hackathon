import type { PriceUnit, User } from "./types";

export const rm = (n: number) => `RM${Number.isInteger(n) ? n : n.toFixed(2)}`;

export const unitLabel: Record<PriceUnit, string> = {
  day: "day",
  night: "night",
  hour: "hour",
  slot: "slot",
  job: "job",
  unit: "unit",
  visit: "visit",
  set: "set",
};

/** ISO date (yyyy-mm-dd) in local time. */
export function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseIso(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** The coming Saturday (or the one after, if today is Saturday). */
export function nextSaturday(from = new Date()) {
  const diff = (6 - from.getDay() + 7) % 7 || 7;
  return addDays(from, diff);
}

const dayFmt = new Intl.DateTimeFormat("en-MY", { weekday: "short", day: "numeric", month: "short" });
const timeFmt = new Intl.DateTimeFormat("en-MY", { hour: "numeric", minute: "2-digit" });

export const fmtDay = (iso: string) => dayFmt.format(iso.length > 10 ? new Date(iso) : parseIso(iso));
export const fmtTime = (iso: string) => timeFmt.format(new Date(iso)).replace(" ", "").toLowerCase();

/** Rental length: both ends count for day rentals, nights for overnight ones. */
export function units(from: string, to: string, unit: PriceUnit) {
  if (unit !== "day" && unit !== "night") return 1;
  const diff = Math.round((parseIso(to).getTime() - parseIso(from).getTime()) / 86_400_000);
  if (unit === "night") return Math.max(1, diff);
  return Math.max(1, diff + 1);
}

function streetNo(street: string) {
  const m = street.match(/(\d+)\/(\d+)/);
  return m ? { block: Number(m[1]), no: Number(m[2]) } : { block: 0, no: 0 };
}

/** Rough walking distance from street numbers, good enough for the demo. */
export function distance(a: User | undefined, b: User | undefined) {
  if (!a || !b || a.id === b.id) return 0;
  const x = streetNo(a.street);
  const y = streetNo(b.street);
  if (x.block === y.block) return 60 + Math.abs(x.no - y.no) * 60;
  return 700 + Math.abs(x.no - y.no) * 30;
}

export const fmtDistance = (m: number) => (m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`);

export const fmtPoints = (n: number) => n.toLocaleString("en-MY");

export function timeAgo(iso: string) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

/** "Free BBQ pit slot" becomes "free BBQ pit slot", but "RM20 voucher" stays as is. */
export function lowerFirst(s: string) {
  return /^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}
