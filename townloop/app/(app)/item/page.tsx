"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArtIcon } from "@/components/Art";
import { ForecastCard } from "@/components/Forecast";
import { ChatPolicy, useTrackRecord } from "@/components/People";
import { BackIcon, HeartIcon } from "@/components/Icons";
import { Avatar, Badge, Button, Empty, inputClass, LinkButton, Page, Rating, TextField } from "@/components/ui";
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
      <div className="mx-auto w-full max-w-5xl md:px-8 md:pt-8">
        <div className="md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10">
          <div className="relative flex aspect-[4/3] md:sticky md:top-24 md:self-start items-center justify-center bg-surface md:rounded-[14px]">
            <button onClick={() => router.back()} aria-label="Back" className="absolute top-3 left-3 flex size-10 items-center justify-center rounded-full bg-white">
              <BackIcon size={20} />
            </button>
            <button
              onClick={() => toggleSave(l.id)}
              aria-label={saved ? "Remove from saved" : "Save"}
              aria-pressed={saved}
              className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full bg-white"
            >
              <HeartIcon size={20} filled={saved} />
            </button>
            <ArtIcon art={l.art} size={150} />
            <span className="absolute bottom-3 left-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-muted">Illustration, photos coming soon</span>
          </div>

          <div className="px-4 pt-5 pb-48 sm:px-8 md:px-0 md:pt-0 md:pb-16">
            <div className="flex flex-wrap gap-1.5">
              {l.free ? <Badge kind="free" /> : null}
              {l.facility ? <Badge kind="facility" /> : null}
              {kind ? <Badge kind={kind} /> : null}
              <span className="text-[12px] text-muted">{l.category}</span>
            </div>
            <h1 className="mt-2 text-[24px] leading-tight font-semibold tracking-[-0.02em]">{l.title}</h1>
            <p className="mt-1.5 text-[20px] font-semibold">
              {l.free ? "Free to borrow" : rm(l.price)}
              {!l.free ? <span className="text-[14px] font-normal text-muted"> per {unitLabel[l.unit]}</span> : null}
            </p>
            <p className="mt-1 text-[13px] text-muted">
              <Rating value={l.rating} count={l.reviews} /> · {l.done} {l.tier === "rent" ? "loops" : "jobs"} done
            </p>

            {/* Who */}
            <Link href={`/person?id=${l.ownerId}`} className="mt-5 flex items-center gap-3 border-y border-line py-3.5 hover:bg-surface/50">
              <Avatar name={ownerName} vendor={!!v} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-[15px] font-semibold">
                  {mine ? "You" : ownerName}
                  {resident && !l.facility ? <Badge kind="verified" /> : null}
                </span>
                <span className="block text-[13px] text-muted">
                  {resident ? `${resident.street}${m ? ` · ${fmtDistance(m)} away` : ""}` : v ? `${v.area} · ${v.checks.join(", ")}` : ""}
                </span>
              </span>
              <span className="text-[13px] text-muted">
                <Rating value={track.avg || l.rating} />
              </span>
            </Link>

            <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{l.description}</p>

            <dl className="mt-3 text-[15px]">
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
              <LinkButton href={`/booking?id=${open.id}`} className="mt-6 w-full">See your booking</LinkButton>
            ) : (
              <div className="mt-6 space-y-4">
                {isDay ? (
                  <div className="grid grid-cols-2 gap-3">
                    <DateField label="From" value={from} min={isoDate(new Date())} onChange={(v) => { setFrom(v); setError(""); if (v > to) setTo(v); }} />
                    <DateField label={l.unit === "night" ? "Until" : "Return"} value={to} min={from} onChange={(v) => { setTo(v); setError(""); }} />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <DateField label="Date" value={from} min={isoDate(new Date())} onChange={(v) => { setFrom(v); setError(""); }} />
                    {l.tier !== "rent" ? (
                      <label className="block rounded-[10px] border border-line-strong px-3.5 py-2.5 focus-within:border-ink">
                        <span className="block text-[12px] text-muted">Time</span>
                        <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-transparent text-[15px] font-medium outline-none">
                          {TIMES.map((t) => <option key={t}>{t}</option>)}
                        </select>
                      </label>
                    ) : null}
                  </div>
                )}

                {l.tier === "vendors" && l.groupPrice ? (
                  <fieldset className="space-y-2">
                    <legend className="mb-1 text-[14px] font-medium">How do you want to book?</legend>
                    <Choice checked={group} onChange={() => setGroup(true)} title={`Join the street group, ${rm(l.groupPrice)}`} note={g ? `${g.joined.length} of ${g.target} homes on ${g.street} are in. Same visit day, ${fmtDay(g.date)}.` : "Cheaper when the street books together."} />
                    <Choice checked={!group} onChange={() => setGroup(false)} title={`Book on my own, ${rm(l.price)}`} note="Any day that suits you." />
                  </fieldset>
                ) : null}
                {l.tier === "vendors" && l.recurring ? (
                  <label className="flex items-start gap-3 text-[14px]">
                    <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} className="mt-1 size-4 accent-[#1A1A1A]" />
                    <span>
                      <span className="font-medium">Repeat {l.recurring.toLowerCase()}</span>
                      <span className="block text-muted">Earn 30 Eco points every visit.</span>
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
                {!l.facility ? <ChatPolicy name={ownerName} /> : <p className="text-[13px] text-muted">SDP facilities confirm straight away.</p>}

                <div className="fixed inset-x-0 bottom-16 z-20 border-t border-line bg-white px-4 py-3 md:static md:border-0 md:p-0">
                  <div className="mx-auto flex max-w-2xl items-center gap-4">
                    <div className="flex-1">
                      <span className="block text-[18px] font-semibold">{l.free ? "Free" : rm(total)}</span>
                      <span className="text-[13px] text-muted">
                        {isDay ? `${n} ${unitLabel[l.unit]}${n > 1 ? "s" : ""}` : l.tier === "rent" ? "one slot" : `per ${unitLabel[l.unit]}`}
                        {l.deposit ? ` · ${rm(l.deposit)} deposit held` : ""}
                      </span>
                    </div>
                    <Button onClick={submit}>{l.facility ? "Book slot" : "Send request"}</Button>
                  </div>
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

function Choice({ checked, onChange, title, note }: { checked: boolean; onChange: () => void; title: string; note: string }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 rounded-[10px] border px-3.5 py-3 ${checked ? "border-ink" : "border-line-strong"}`}>
      <input type="radio" checked={checked} onChange={onChange} className="mt-1 size-4 accent-[#1A1A1A]" />
      <span>
        <span className="block text-[15px] font-medium">{title}</span>
        <span className="block text-[13px] text-muted">{note}</span>
      </span>
    </label>
  );
}

function DateField({ label, value, min, onChange }: { label: string; value: string; min?: string; onChange: (v: string) => void }) {
  return (
    <label className="block rounded-[10px] border border-line-strong px-3.5 py-2.5 focus-within:border-ink">
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
