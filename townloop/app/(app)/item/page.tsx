"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArtPhoto } from "@/components/Art";
import { ForecastCard } from "@/components/Forecast";
import { ChatPolicy, useTrackRecord } from "@/components/People";
import { ArrowRightIcon, BackIcon, HeartIcon, ShareIcon } from "@/components/Icons";
import { Avatar, Badge, Button, Empty, inputClass, LinkButton, Meta, Page, Rating, Stars, TextField } from "@/components/ui";
import { vendorKindOf } from "@/lib/data";
import { addDays, distance, fmtDay, fmtDistance, isoDate, nextSaturday, rm, unitLabel, units } from "@/lib/format";
import { useStore } from "@/lib/store";

const TIMES = ["9am", "11am", "3pm", "5pm", "8pm"];

function ListingPageInner() {
  const id = useSearchParams().get("id") ?? "";
  const router = useRouter();
  const { me, listing, user, vendor, nameOf, state, requestBooking, toggleSave } = useStore();
  const l = listing(id);

  const sat = nextSaturday();
  const [from, setFrom] = useState(isoDate(sat));
  const [to, setTo] = useState(isoDate(addDays(sat, 1)));
  const [time, setTime] = useState("3pm");
  const [group, setGroup] = useState(true);
  const [recurring, setRecurring] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [shared, setShared] = useState(false);
  const track = useTrackRecord(l?.ownerId ?? "");

  if (!l || !me) {
    return (
      <Page>
        <Empty title="This listing is gone">
          <Link href="/home" className="font-semibold text-ink underline">Back to home</Link>
        </Empty>
      </Page>
    );
  }

  const resident = user(l.ownerId);
  const v = vendor(l.ownerId);
  const kind = vendorKindOf(l);
  const ownerName = nameOf(l.ownerId);
  const mine = l.ownerId === me.id;
  const m = distance(me, resident);
  const saved = state.saved.includes(l.id);
  const g = state.groups.find((x) => x.listingId === l.id);
  const isDay = l.unit === "day" || l.unit === "night";
  const n = isDay ? units(from, to, l.unit) : 1;
  const unitPrice = l.tier === "vendors" && group && l.groupPrice ? l.groupPrice : l.price;
  const total = l.free ? 0 : unitPrice * n;
  const open = state.bookings.find(
    (b) => b.listingId === l.id && b.customerId === me.id && !["closed", "declined"].includes(b.status),
  );
  const incoming = state.requests.filter((r) => r.toId === me.id && r.status === "pending" && state.bookings.some((b) => b.id === r.bookingId && b.listingId === l.id)).length;

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: l!.title, url });
      else await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch {
      /* closed the share sheet */
    }
  }

  function submit() {
    if (isDay && to < from) return setError("The return date can't be before the start date.");
    if (!l!.facility && !message.trim()) return setError(`Say hi to ${ownerName} and what it's for.`);
    const bid = requestBooking(l!.id, {
      from,
      to: isDay ? to : from,
      time: l!.tier === "rent" ? undefined : time,
      group: l!.tier === "vendors" && !!l!.groupPrice && group,
      recurring: l!.tier === "vendors" && !!l!.recurring && recurring,
      message: message.trim(),
    });
    if (bid) router.push(`/booking?id=${bid}`);
  }

  return (
    <div>
      <div className="mx-auto w-full max-w-5xl px-4 pt-2 sm:px-8 md:pt-6">
        <div className="md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-surface md:sticky md:top-24 md:self-start">
            <ArtPhoto art={l.art} w={1200} h={900} alt={l.title} iconSize={150} eager />
            <button onClick={() => router.back()} aria-label="Back" className="press absolute top-3 left-3 flex size-11 items-center justify-center rounded-full bg-white shadow-sm">
              <BackIcon size={20} />
            </button>
            {l.rating ? (
              <span className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[12px] leading-none font-semibold shadow-sm">
                <svg width="12" height="12" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.8l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.7l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z" fill="#FFB020" /></svg>
                {l.rating.toFixed(1)}
              </span>
            ) : null}
            <div className="absolute right-3 bottom-3 flex gap-2">
              <button onClick={share} aria-label="Share" className="press flex size-11 items-center justify-center rounded-full bg-night/70 text-white backdrop-blur-md">
                <ShareIcon size={19} />
              </button>
              <button
                onClick={() => toggleSave(l.id)}
                aria-label={saved ? "Remove from saved" : "Save"}
                aria-pressed={saved}
                className={`press flex size-11 items-center justify-center rounded-full backdrop-blur-md ${saved ? "bg-ember text-white" : "bg-night/70 text-white"}`}
              >
                <HeartIcon size={20} />
              </button>
            </div>
            {shared ? <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1.5 text-[12px] font-semibold text-white">Link copied</span> : null}
          </div>

          <div className="pt-5 pb-64 md:pt-0 md:pb-16">
            <div className="flex flex-wrap gap-1.5">
              {l.free ? <Badge kind="free" /> : null}
              {l.facility ? <Badge kind="facility" /> : null}
              {kind ? <Badge kind={kind} /> : null}
              <span className="text-[12px] text-muted">{l.category}</span>
            </div>
            <h1 className="mt-2.5 font-display text-[23px] leading-[1.15] font-semibold tracking-[-0.035em] sm:text-[28px]">{l.title}</h1>
            <p className="mt-2.5 flex flex-wrap items-baseline gap-x-2">
              <span className="font-display text-[26px] font-bold tracking-[-0.04em]">{l.free ? "Free" : rm(l.price)}</span>
              {!l.free ? <span className="text-[14px] text-muted">per {unitLabel[l.unit]}</span> : <span className="text-[14px] text-muted">to borrow</span>}
              {l.groupPrice ? <span className="rounded-full bg-sun px-2.5 py-1 text-[12px] font-semibold">{rm(l.groupPrice)} in a street group</span> : null}
            </p>
            <Meta className="mt-2 text-[13px]" items={[{ text: <Rating value={l.rating} count={l.reviews} stars /> }, { icon: "check", text: `${l.done} ${l.tier === "rent" ? "loops" : "jobs"} done` }]} />
            <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{l.description}</p>

            {/* Who */}
            <Link href={`/person?id=${l.ownerId}`} className="press mt-5 flex items-center gap-3.5 rounded-[24px] bg-white p-3 hover:shadow-[0_10px_24px_-16px_rgba(21,23,28,0.4)]">
              <Avatar name={ownerName} vendor={!!v} size={52} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[16px] font-semibold">{mine ? "You" : ownerName}</span>
                <span className="mt-1 flex flex-wrap items-center gap-1.5">
                  {resident && !l.facility ? <Badge kind="verified" /> : null}
                  {kind ? <Badge kind={kind} /> : null}
                  <Stars value={track.avg || l.rating} size={13} />
                </span>
                <Meta
                  className="mt-1 text-[12px]"
                  items={resident ? [{ icon: "pin", text: resident.street }, m ? { text: `${fmtDistance(m)} away` } : null] : v ? [{ icon: "pin", text: v.area }] : []}
                />
              </span>
            </Link>

            <dl className="mt-3 rounded-[24px] bg-white px-4 text-[14px] [&>div:last-child]:border-b-0">
              {l.deposit ? <Row label="Deposit" value={`${rm(l.deposit)}, held not charged`} /> : null}
              <Row label={l.tier === "rent" ? "Pick up" : "Availability"} value={l.when} />
              {l.groupPrice && g ? <Row label="Street group" value={`${rm(l.groupPrice)} each, ${g.joined.length} of ${g.target} joined`} /> : null}
              {l.recurring ? <Row label="Plan" value={l.recurring} /> : null}
            </dl>

            {l.tier === "vendors" ? (
              <div className="mt-5">
                <ForecastCard compact topic={l.category === "Aircond" ? "Aircond servicing" : `${l.category} demand`} />
              </div>
            ) : null}

            {mine ? (
              <div className="mt-6 text-[14px] text-muted">
                This is your listing.{" "}
                {incoming ? (
                  <Link href="/me" className="font-semibold text-ink underline underline-offset-2">{incoming} waiting for you on Me</Link>
                ) : (
                  "Requests show up on Me."
                )}
              </div>
            ) : open ? (
              <LinkButton href={`/booking?id=${open.id}`} variant="accent" size="lg" className="mt-6 w-full">See your booking</LinkButton>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Panel label={isDay ? "Pick up" : "Date"}>
                    <input type="date" value={from} min={isoDate(new Date())} onChange={(e) => { const v = e.target.value; if (!v) return; setFrom(v); setError(""); if (v > to) setTo(v); }} className="w-full bg-transparent text-[15px] font-semibold outline-none" />
                  </Panel>
                  {isDay ? (
                    <Panel label={l.unit === "night" ? "Until" : "Return"} dark>
                      <input type="date" value={to} min={from} onChange={(e) => { if (!e.target.value) return; setTo(e.target.value); setError(""); }} className="w-full bg-transparent text-[15px] font-semibold text-white outline-none [color-scheme:dark]" />
                    </Panel>
                  ) : l.tier !== "rent" ? (
                    <Panel label="Time" dark>
                      <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-transparent text-[15px] font-semibold text-white outline-none [&>option]:text-ink">
                        {TIMES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </Panel>
                  ) : (
                    <Panel label="Slot" dark>
                      <span className="block text-[15px] font-semibold text-white">{l.when.split(",")[0]}</span>
                    </Panel>
                  )}
                </div>

                {l.tier === "vendors" && l.groupPrice ? (
                  <fieldset className="space-y-2">
                    <legend className="mb-1 text-[14px] font-medium">How do you want to book?</legend>
                    <Choice checked={group} onChange={() => setGroup(true)} title={`Join the street group, ${rm(l.groupPrice)}`} note={g ? `${g.joined.length} of ${g.target} homes on ${g.street} are in. Same visit day, ${fmtDay(g.date)}.` : "Cheaper when the street books together."} />
                    <Choice checked={!group} onChange={() => setGroup(false)} title={`Book on my own, ${rm(l.price)}`} note="Any day that suits you." />
                  </fieldset>
                ) : null}
                {l.tier === "vendors" && l.recurring ? (
                  <label className="flex items-start gap-3 text-[14px]">
                    <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} className="mt-1 size-4 accent-[#F26B2E]" />
                    <span>
                      <span className="font-medium">Repeat {l.recurring.toLowerCase()}</span>
                      <span className="block text-muted">+30 points every visit</span>
                    </span>
                  </label>
                ) : null}

                {!l.facility ? (
                  <TextField label={`Message to ${ownerName}`} error={error && !message.trim() ? error : undefined}>
                    <textarea
                      value={message}
                      onChange={(e) => { setMessage(e.target.value); setError(""); }}
                      rows={2}
                      placeholder={l.tier === "rent" ? "Hi, washing the porch this weekend." : l.tier === "gigs" ? "Front and back lawn, about 60 square metres." : "3 units, two bedrooms and the living room."}
                      className={`${inputClass(error && !message.trim())} h-auto py-3`}
                    />
                  </TextField>
                ) : null}
                {error && message.trim() ? <p className="text-[13px] text-[#B42318]">{error}</p> : null}
                {!l.facility ? <ChatPolicy name={ownerName} /> : <p className="text-[13px] text-muted">Confirmed straight away.</p>}

                <div className="fixed inset-x-0 bottom-[92px] z-20 px-4 md:static md:px-0">
                  <button
                    onClick={submit}
                    className="press mx-auto flex h-[60px] w-full max-w-2xl items-center gap-3 rounded-[20px] bg-ember pr-2 pl-5 text-white shadow-[0_14px_30px_-12px_rgba(242,107,46,0.8)] hover:bg-[#E35D20]"
                  >
                    <span className="min-w-0 flex-1 truncate text-left font-display text-[12px] font-semibold tracking-[0.03em] uppercase">
                      {l.facility ? "Book this slot" : `Request to chat with ${ownerName.startsWith("Pak ") ? ownerName : ownerName.split(" ")[0]}`}
                    </span>
                    <span className="flex h-11 shrink-0 items-center gap-2 rounded-[14px] bg-white/15 px-3">
                      <span className="font-display text-[14px] font-bold tracking-[-0.03em]">{l.free ? "Free" : rm(total)}</span>
                      <ArrowRightIcon size={16} />
                    </span>
                  </button>
                  {l.deposit ? (
                    <p className="mx-auto mt-1.5 max-w-2xl text-center text-[11px] text-muted md:text-left">{rm(l.deposit)} deposit held, not charged</p>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-line py-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

/** Light or night block with a small caps label, like a shop's "choose size" box. */
function Panel({ label, dark = false, children }: { label: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <label className={`relative block overflow-hidden rounded-[20px] px-4 pt-3 pb-3.5 ${dark ? "bg-night text-white" : "bg-white text-ink"}`}>
      <span className={`mb-1.5 block font-display text-[10px] font-semibold tracking-[0.06em] uppercase ${dark ? "text-white/60" : "text-muted"}`}>{label}</span>
      {children}
    </label>
  );
}

function Choice({ checked, onChange, title, note }: { checked: boolean; onChange: () => void; title: string; note: string }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 rounded-[20px] border-2 px-4 py-3.5 ${checked ? "border-ember bg-white" : "border-transparent bg-white"}`}>
      <input type="radio" checked={checked} onChange={onChange} className="mt-1 size-4 accent-[#F26B2E]" />
      <span>
        <span className="block text-[15px] font-medium">{title}</span>
        <span className="block text-[13px] text-muted">{note}</span>
      </span>
    </label>
  );
}

function DateField({ label, value, min, onChange }: { label: string; value: string; min?: string; onChange: (v: string) => void }) {
  return (
    <label className="block rounded-[12px] border border-line-strong px-3.5 py-2.5 focus-within:border-ink">
      <span className="block text-[12px] text-muted">{label}</span>
      <input type="date" value={value} min={min} onChange={(e) => e.target.value && onChange(e.target.value)} className="w-full bg-transparent text-[15px] font-medium outline-none" />
    </label>
  );
}

/** Static hosting friendly: the id comes from ?id= so every item works without a server. */
export default function ListingPage() {
  return (
    <Suspense fallback={null}>
      <ListingPageInner />
    </Suspense>
  );
}
