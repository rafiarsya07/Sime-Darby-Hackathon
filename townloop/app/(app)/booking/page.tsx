"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { ArtPhoto } from "@/components/Art";
import { QrCode } from "@/components/QrCode";
import { RequestCard, useTrackRecord } from "@/components/People";
import { CameraIcon, CheckIcon, EcoPointsIcon, MessagesIcon, StarIcon } from "@/components/Icons";
import { Avatar, BackButton, Badge, Button, DemoNote, Dot, Empty, inputClass, LinkButton, Page, Rating } from "@/components/ui";
import { REWARDS, USERS, VENDORS } from "@/lib/data";
import { fmtDay, fmtPoints, fmtTime, rm, unitLabel, units } from "@/lib/format";
import { awardsFor, DISPUTE_HOURS } from "@/lib/points";
import { useStore, whatsappLink } from "@/lib/store";
import type { BookingStatus } from "@/lib/types";

const STEPS: Record<"rent" | "other", { status: BookingStatus; label: string }[]> = {
  rent: [
    { status: "requested", label: "Requested" },
    { status: "accepted", label: "Accepted" },
    { status: "in_use", label: "Picked up" },
    { status: "done", label: "Returned" },
    { status: "closed", label: "Points paid" },
  ],
  other: [
    { status: "requested", label: "Requested" },
    { status: "accepted", label: "Accepted" },
    { status: "done", label: "Job done" },
    { status: "closed", label: "Points paid" },
  ],
};

function BookingPageInner() {
  const id = useSearchParams().get("id") ?? "";
  const router = useRouter();
  const { me, state, nameOf, user, vendor, listing, balance, setStatus, closeBooking, answerRequest, review, fillGroup } = useStore();
  const [scanning, setScanning] = useState(false);
  const [reported, setReported] = useState(false);
  const b = state.bookings.find((x) => x.id === id);
  const otherId = b ? (b.customerId === me?.id ? b.providerId : b.customerId) : "";
  const track = useTrackRecord(otherId);

  if (!b || !me) {
    return (
      <Page>
        <Empty title="We couldn't find that booking">
          <Link href="/bookings" className="font-semibold text-ink underline">See your bookings</Link>
        </Empty>
      </Page>
    );
  }

  const isProvider = b.providerId === me.id;
  const other = nameOf(otherId);
  const provider = nameOf(b.providerId);
  const customer = nameOf(b.customerId);
  const short = b.title.split(",")[0];
  const v = vendor(b.providerId);
  const request = state.requests.find((r) => r.bookingId === b.id);
  const group = b.group ? state.groups.find((g) => g.listingId === b.listingId) : undefined;
  const reached = (s: BookingStatus) => b.events.find((e) => e.status === s);
  const doneAt = reached("done")?.at;
  const closesAt = doneAt ? new Date(new Date(doneAt).getTime() + DISPUTE_HOURS * 3_600_000).toISOString() : null;
  const reviewed = state.reviews.some((r) => r.byId === me.id && r.aboutId === otherId && r.at >= (doneAt ?? ""));
  const paid = state.points.filter((p) => p.bookingId === b.id && p.userId === me.id);
  const preview = awardsFor(
    { ...b, onTime: b.onTime ?? true },
    { vendorKind: v?.kind, customer: USERS.find((u) => u.id === b.customerId), provider: USERS.find((u) => u.id === b.providerId) },
  ).filter((a) => a.userId === me.id);
  const previewTotal = preview.reduce((s, a) => s + a.amount, 0);
  const earned = paid.reduce((s, p) => s + p.amount, 0);
  const bal = balance(me.id);
  const nextReward = REWARDS.filter((r) => r.id !== "donate").sort((a, c) => a.cost - c.cost).find((r) => r.cost > bal);
  const lst = b.listingId ? listing(b.listingId) : undefined;
  const lineItem = lst && !b.free
    ? (() => {
        const isDay = lst.unit === "day" || lst.unit === "night";
        const n = isDay ? units(b.from, b.to, lst.unit) : 1;
        const unit = b.group && lst.groupPrice ? lst.groupPrice : lst.price;
        return { label: `${rm(unit)} × ${n} ${unitLabel[lst.unit]}${n > 1 ? "s" : ""}`, value: rm(unit * n) };
      })()
    : null;

  function scan(next: BookingStatus) {
    setScanning(true);
    setTimeout(() => {
      setStatus(b!.id, next);
      setScanning(false);
    }, 900);
  }

  const whatsapp = (
    <a
      href={whatsappLink(`Hi ${other}, it's ${me.name} from TownLoop about "${short}" (booking ${b.id}).`)}
      target="_blank"
      rel="noreferrer"
      className="press inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] border border-line-strong text-[16px] font-semibold hover:border-ink"
    >
      <MessagesIcon size={20} /> Chat with {other} on WhatsApp
    </a>
  );

  return (
    <Page>
      <div className="flex items-center justify-between">
        <BackButton onClick={() => router.back()} />
        <span className="rounded-full bg-surface px-3 py-1.5 text-[12px] font-semibold text-ink-2">Booking {b.id.toUpperCase()}</span>
      </div>

      {b.status !== "declined" ? <Stepper steps={STEPS[b.tier === "rent" ? "rent" : "other"]} reached={reached} /> : null}

      <div className="relative mt-5 aspect-[16/8] overflow-hidden rounded-[18px] bg-surface">
        <ArtPhoto art={b.art} w={1000} h={500} alt={b.title} iconSize={80} eager />
      </div>

      <section className="mt-6" aria-live="polite">
        {b.status === "declined" ? (
          <Headline eyebrow="Not this time" title={isProvider ? "You declined this request" : `${provider} can't take this one`}>
            <p className="mt-2 text-[14px] text-muted">No contact details were shared.</p>
            {!isProvider ? <LinkButton href="/home" variant="secondary" className="mt-5 w-full">Find something similar</LinkButton> : null}
          </Headline>
        ) : null}

        {b.status === "requested" && isProvider && request ? (
          <Headline eyebrow="New request" title={`${customer} wants to book your ${short.toLowerCase()}`}>
            <p className="mt-2 text-[14px] text-muted">Check their profile first. Your number is only shared if you accept.</p>
            <div className="mt-2">
              <RequestCard r={request} />
            </div>
          </Headline>
        ) : null}

        {b.status === "requested" && !isProvider ? (
          <Headline eyebrow="Request sent" title={`Waiting for ${provider} to accept`}>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              {provider} is looking at your profile. When they accept, TownLoop opens a WhatsApp chat between you. Until then neither of you sees the other&apos;s number.
            </p>
            {request ? (
              <DemoNote>
                <button onClick={() => answerRequest(request.id, true)} className="font-semibold underline underline-offset-2">Let {provider} accept</button>
                <button onClick={() => answerRequest(request.id, false)} className="underline underline-offset-2">or decline</button>
              </DemoNote>
            ) : null}
          </Headline>
        ) : null}

        {b.status === "accepted" ? (
          <>
            {b.tier === "rent" && isProvider ? (
              <Headline eyebrow={`${customer} picks up ${fmtDay(b.from)}`} title={`Ask ${customer} to scan this`}>
                <div className="mt-5 flex flex-col items-center gap-3 rounded-[14px] border border-line p-6">
                  <QrCode value={`townloop://booking/${b.id}/pickup/${b.code}`} label={`Pick up code for booking ${b.id}`} />
                  <span className="text-[13px] text-muted">Or type {b.code}</span>
                </div>
                <DemoNote>
                  <button onClick={() => scan("in_use")} disabled={scanning} className="font-semibold underline underline-offset-2">
                    {scanning ? `${customer} is scanning…` : `Pretend ${customer} scanned it`}
                  </button>
                </DemoNote>
              </Headline>
            ) : null}
            {b.tier === "rent" && !isProvider ? (
              <Headline eyebrow={`Pick up ${fmtDay(b.from)}`} title={b.facility ? "Show your code at the park" : `Scan ${provider}'s code at the gate`}>
                <p className="mt-2 text-[14px] text-muted">
                  {b.deposit ? `Your ${rm(b.deposit)} deposit is held when you scan, not charged.` : "Nothing is charged until you scan."}
                </p>
                <Button className="mt-5 w-full" onClick={() => scan("in_use")} disabled={scanning}>
                  <CameraIcon size={20} /> {scanning ? "Scanning…" : "Scan code"}
                </Button>
              </Headline>
            ) : null}
            {b.tier !== "rent" ? (
              <Headline eyebrow={`${fmtDay(b.from)}${b.time ? `, ${b.time}` : ""}`} title={isProvider ? `You're helping ${customer}` : `${provider} is booked`}>
                <p className="mt-2 text-[14px] text-muted">
                  {isProvider ? "When the job is done, mark it here." : "When the job is done, confirm it here. Pay directly by cash or DuitNow."}
                </p>
                <Button className="mt-5 w-full" onClick={() => setStatus(b.id, "done")}>
                  <CheckIcon size={20} /> {isProvider ? "Mark job as done" : "Confirm job is done"}
                </Button>
              </Headline>
            ) : null}
            {b.group && group ? (
              <div className="mt-4 rounded-[12px] border border-line px-4 py-3.5">
                <p className="flex justify-between text-[14px]">
                  <span className="font-semibold">Street group on {group.street}</span>
                  <span className="tabular-nums text-muted">{group.joined.length} of {group.target}</span>
                </p>
                <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-surface">
                  <span className="block h-full rounded-full bg-ember" style={{ width: `${Math.min(100, (group.joined.length / group.target) * 100)}%` }} />
                </span>
                <p className="mt-2 text-[13px] text-muted">
                  {group.joined.length >= group.target
                    ? "Group is full. Everyone in it earns 50 extra points when the job closes."
                    : `${group.target - group.joined.length} more homes and everyone earns 50 extra points.`}
                </p>
                {group.joined.length < group.target ? (
                  <DemoNote>
                    <button onClick={() => fillGroup(group.id)} className="font-semibold underline underline-offset-2">Fill the group with neighbours</button>
                  </DemoNote>
                ) : null}
              </div>
            ) : null}
            {!b.facility && b.providerKind === "resident" ? <div className="mt-3">{whatsapp}</div> : null}
            {b.providerKind === "vendor" ? <div className="mt-3">{whatsapp}</div> : null}
          </>
        ) : null}

        {b.status === "in_use" ? (
          isProvider ? (
            <Headline eyebrow={`Back by ${fmtDay(b.to)}`} title={`${customer} has your ${short.toLowerCase()}`}>
              <p className="mt-2 text-[14px] text-muted">When it&apos;s back, check it and scan to release the deposit.</p>
              <Button className="mt-5 w-full" onClick={() => scan("done")} disabled={scanning}>
                <CameraIcon size={20} /> {scanning ? "Scanning…" : "Scan it back"}
              </Button>
              <div className="mt-3">{whatsapp}</div>
            </Headline>
          ) : (
            <Headline eyebrow={`Return by ${fmtDay(b.to)}`} title={`Enjoy the ${short.toLowerCase()}`}>
              <p className="mt-2 text-[14px] text-muted">Bring it back to {provider}. Return on time for 10 extra points.</p>
              <DemoNote>
                <button onClick={() => scan("done")} disabled={scanning} className="font-semibold underline underline-offset-2">
                  {scanning ? `${provider} is scanning…` : `Pretend ${provider} scanned it back`}
                </button>
              </DemoNote>
              <div className="mt-3">{whatsapp}</div>
            </Headline>
          )
        ) : null}

        {b.status === "done" && closesAt ? (
          <Headline eyebrow={b.tier === "rent" ? "Returned" : "Job done"} title={`Points land ${fmtDay(closesAt)}, ${fmtTime(closesAt)}`}>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              There&apos;s a {DISPUTE_HOURS} hour window to report a problem. After that the booking closes and{" "}
              {previewTotal ? <strong className="font-semibold text-ink">{previewTotal} Eco points</strong> : "your points"} go to you.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="secondary" size="sm" onClick={() => setReported(true)} disabled={reported}>
                {reported ? "Report started" : "Report a problem"}
              </Button>
            </div>
            {reported ? (
              <p className="mt-2 text-[13px] text-muted">In the live app this opens a form for photos and notes, and the TownLoop team holds the points and deposit until it&apos;s sorted.</p>
            ) : null}
            <DemoNote>
              <button onClick={() => closeBooking(b.id)} className="font-semibold underline underline-offset-2">Skip the {DISPUTE_HOURS} hours</button>
            </DemoNote>
          </Headline>
        ) : null}

        {b.status === "closed" ? (
          <Headline eyebrow="Closed" title={isProvider ? `Thanks for helping ${customer}` : `All done with ${provider}`}>
            {paid.length ? (
              <ul className="mt-3 space-y-1.5">
                {paid.map((p) => (
                  <li key={p.id} className="flex items-center gap-2 text-[15px]">
                    <Dot /> <span className="flex-1">{p.label}</span> <span className="font-semibold">+{p.amount}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[14px] text-muted">{b.providerKind === "vendor" && isProvider ? "" : "No points on this one."}</p>
            )}
            <LinkButton href="/me/points" variant="secondary" className="mt-5 w-full">See your points</LinkButton>
          </Headline>
        ) : null}

        {(b.status === "done" || b.status === "closed") && !reviewed && otherId !== "sdp" ? <ReviewForm name={other} hint={isProvider ? "Friendly, paid on time." : b.tier === "rent" ? "Clean and ready on time." : "Neat work, came on time."} onSubmit={(s, t) => review(b.id, s, t)} /> : null}
      </section>

      <section className="mt-8 rounded-[18px] border border-line p-4">
        <h2 className="text-[16px] font-semibold">{b.title}</h2>
        <dl className="mt-2 space-y-1.5 text-[14px]">
          <div className="flex justify-between gap-4"><dt className="text-muted">Date</dt><dd>{fmtDay(b.from)}{b.to !== b.from ? ` to ${fmtDay(b.to)}` : ""}{b.time ? `, ${b.time}` : ""}</dd></div>
          {lineItem ? <div className="flex justify-between gap-4"><dt className="text-muted">{lineItem.label}</dt><dd>{lineItem.value}</dd></div> : null}
          {b.group ? <div className="flex justify-between gap-4"><dt className="text-muted">Street group</dt><dd>{group ? `${group.joined.length} of ${group.target} homes` : "Yes"}</dd></div> : null}
          {b.deposit ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Deposit</dt>
              <dd>{rm(b.deposit)} {b.status === "in_use" ? "held" : b.status === "done" || b.status === "closed" ? "released" : "on pick up"}</dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
          <span className="text-[15px] font-semibold">Total</span>
          <span className="text-[20px] font-semibold tracking-[-0.01em]">{b.total ? rm(b.total) : "Free"}</span>
        </div>
        <p className="mt-1 text-[12px] text-muted">{b.providerKind === "vendor" ? "Paid to the vendor after the job." : "Paid directly by cash or DuitNow."}</p>
      </section>

      {b.status !== "declined" ? (
        <section className="mt-4 rounded-[18px] bg-[#F1F8F3] p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-[16px] font-semibold"><EcoPointsIcon size={22} /> Eco points</h2>
            <span className="text-[13px] font-semibold text-[#17803D]">
              {earned ? `+${fmtPoints(earned)} earned` : previewTotal ? `+${fmtPoints(previewTotal)} on close` : "None for this one"}
            </span>
          </div>
          <span className="mt-3 block h-2 overflow-hidden rounded-full bg-white">
            <span className="block h-full rounded-full bg-[#22A55B]" style={{ width: `${Math.min(100, (bal / (nextReward?.cost ?? Math.max(bal, 1))) * 100)}%` }} />
          </span>
          <p className="mt-2 flex items-center justify-between text-[13px] text-ink-2">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#F5A524]" /> {fmtPoints(bal)} points</span>
            <span className="text-muted">{nextReward ? `${fmtPoints(nextReward.cost - bal)} to ${nextReward.title}` : "Enough for any reward"}</span>
          </p>
        </section>
      ) : null}

      <Link href={`/person?id=${otherId}`} className="mt-4 flex items-center gap-3 rounded-[18px] border border-line p-3.5 hover:border-line-strong">
        <Avatar name={other} vendor={!!v && otherId === b.providerId} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 text-[15px] font-semibold">
            {other}
            {v && otherId === b.providerId ? <Badge kind={v.kind} /> : user(otherId) ? <Badge kind="verified" /> : null}
          </span>
          <span className="block text-[13px] text-muted">
            {user(otherId)?.street ?? VENDORS.find((x) => x.id === otherId)?.area} · <Rating value={track.avg} count={track.reviews.length} />
          </span>
        </span>
      </Link>
    </Page>
  );
}

function Headline({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div>
      <p className="text-[13px] font-medium text-muted">{eyebrow}</p>
      <h1 className="mt-1 text-[26px] leading-tight font-semibold tracking-[-0.025em]">{title}</h1>
      {children}
    </div>
  );
}

function ReviewForm({ name, hint, onSubmit }: { name: string; hint: string; onSubmit: (stars: number, text: string) => void }) {
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  return (
    <form
      className="mt-8 border-t border-line pt-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return setError("A few words help your neighbours decide.");
        onSubmit(stars, text.trim());
      }}
    >
      <h2 className="text-[17px] font-semibold">Review {name}</h2>
      <p className="text-[13px] text-muted">+5 Eco points for a review.</p>
      <div className="mt-3 flex gap-1" role="radiogroup" aria-label="Stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            role="radio"
            aria-checked={stars === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => setStars(n)}
            className={`flex size-10 items-center justify-center rounded-[8px] ${n <= stars ? "" : "opacity-25 grayscale"}`}
          >
            <StarIcon size={24} />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError("");
        }}
        rows={2}
        placeholder={hint}
        className={`${inputClass(error)} mt-3 h-auto py-3`}
        aria-label="Your review"
      />
      {error ? <p className="mt-1.5 text-[13px] text-[#B42318]">{error}</p> : null}
      <Button type="submit" size="sm" className="mt-3">Post review</Button>
    </form>
  );
}

/** Static hosting friendly: the id comes from ?id= so every item works without a server. */
export default function BookingPage() {
  return (
    <Suspense fallback={null}>
      <BookingPageInner />
    </Suspense>
  );
}

/** Horizontal progress: green checks for steps reached. */
function Stepper({ steps, reached }: { steps: { status: BookingStatus; label: string }[]; reached: (s: BookingStatus) => { at: string } | undefined }) {
  return (
    <ol className="mt-5 flex items-start">
      {steps.map((s, i) => {
        const hit = !!reached(s.status);
        const nextHit = i < steps.length - 1 && !!reached(steps[i + 1].status);
        return (
          <li key={s.status} className="relative flex flex-1 flex-col items-center text-center">
            {i < steps.length - 1 ? (
              <span className={`absolute top-[13px] left-1/2 h-[3px] w-full rounded-full ${nextHit ? "bg-[#22A55B]" : "bg-line"}`} aria-hidden="true" />
            ) : null}
            <span
              className={`relative z-10 flex size-7 items-center justify-center rounded-full ${hit ? "bg-[#22A55B] text-white" : "border-2 border-line-strong bg-white"}`}
            >
              {hit ? (
                <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10.5l3.2 3.2L15 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : null}
            </span>
            <span className={`mt-1.5 px-0.5 text-[11px] leading-tight sm:text-[12px] ${hit ? "font-semibold text-ink" : "text-muted"}`}>{s.label}</span>
            <span className="sr-only">{hit ? "done" : "not yet"}</span>
          </li>
        );
      })}
    </ol>
  );
}
