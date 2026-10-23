"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ListingCard } from "@/components/Cards";
import { BackIcon, CheckIcon, LockedChatIcon } from "@/components/Icons";
import { useTrackRecord } from "@/components/People";
import { artPhoto, coverPhoto } from "@/lib/photos";
import { Avatar, BackButton, Badge, Empty, Page, Rating, SectionTitle } from "@/components/ui";
import { distance, fmtDistance, timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";

function PersonPageInner() {
  const id = useSearchParams().get("id") ?? "";
  const router = useRouter();
  const { me, user, vendor, nameOf } = useStore();
  const person = user(id);
  const shop = vendor(id);
  const { reviews, avg, done, shares } = useTrackRecord(id);

  if (!person && !shop) {
    return (
      <Page>
        <Empty title="We couldn't find this person">
          <Link href="/home" className="font-semibold text-ink underline">Back home</Link>
        </Empty>
      </Page>
    );
  }

  const name = person?.name ?? shop!.name;
  const rating = shop ? shop.rating : avg;
  const jobs = shop ? shop.jobs : done;
  const self = me?.id === id;

  return (
    <Page>
      {/* Cover: their main listing photo, avatar overlapping */}
      <div className="relative">
        <div className="relative h-40 overflow-hidden rounded-[28px] bg-sun sm:h-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={(shares[0] && artPhoto(shares[0].art, 900, 400)) || coverPhoto()} alt="" className="absolute inset-0 size-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-t from-night/45 to-transparent" />
          <BackButton onClick={() => router.back()} className="absolute top-3 left-3" />
        </div>
        <span className="absolute -bottom-10 left-4 rounded-full ring-[5px] ring-canvas">
          <Avatar name={name} size={88} vendor={!!shop} />
        </span>
      </div>
      <div className="mt-12 px-1">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display text-[22px] leading-tight font-semibold tracking-[-0.03em]">{name}{self ? " (you)" : ""}</h1>
          {person ? <Badge kind="verified" /> : <Badge kind={shop!.kind === "local" ? "local" : "outside"} />}
        </div>
        <p className="mt-1 text-[13px] text-muted">
          {person ? `${person.street} · ${person.phase}` : shop!.area}
          {person && me && !self ? ` · ${fmtDistance(distance(me, person))} away` : ""}
        </p>
      </div>

      {person?.bio ? <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{person.bio}</p> : null}

      <dl className="mt-5 grid grid-cols-3 gap-2 text-center [&>div]:rounded-[20px] [&>div]:bg-white">
        <div className="py-3"><dt className="text-[12px] text-muted">Rating</dt><dd className="mt-0.5 text-[17px] font-semibold"><Rating value={rating} /></dd></div>
        <div className="py-3"><dt className="text-[12px] text-muted">{shop ? "Jobs" : "Loops done"}</dt><dd className="mt-0.5 font-display text-[17px] font-semibold tracking-[-0.03em] tabular-nums">{jobs}</dd></div>
        <div className="py-3"><dt className="text-[12px] text-muted">{shop ? "Trading since" : "On the street since"}</dt><dd className="mt-0.5 font-display text-[17px] font-semibold tracking-[-0.03em]">{person?.since ?? shop!.since}</dd></div>
      </dl>

      {shop ? (
        <>
          <SectionTitle>Checked by SDP</SectionTitle>
          <ul className="space-y-1.5 text-[14px]">
            {shop.checks.map((c) => (
              <li key={c} className="flex items-center gap-2"><CheckIcon size={16} /> {c}</li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-4 flex items-center gap-2 text-[13px] text-muted">
          <LockedChatIcon size={18} /> {person?.tenure} verified with SDP PRIME. Phone number stays hidden until they accept a chat.
        </p>
      )}

      <SectionTitle>{shop ? "Services" : "What they share"}</SectionTitle>
      {shares.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3">{shares.map((l) => <ListingCard key={l.id} l={l} />)}</div>
      ) : (
        <p className="text-[14px] text-muted">Nothing listed yet.</p>
      )}

      <SectionTitle>Previous work</SectionTitle>
      {reviews.length ? (
        <ul className="rounded-[24px] bg-white px-4">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-line py-3 last:border-b-0">
              <div className="flex items-center justify-between gap-3 text-[13px]">
                <span className="font-medium">{r.title}</span>
                <Rating value={r.stars} />
              </div>
              <p className="mt-1 text-[14px] text-ink-2">{r.text}</p>
              <p className="mt-1 text-[12px] text-muted">{nameOf(r.byId)} · {timeAgo(r.at)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[14px] text-muted">No reviews yet.</p>
      )}
    </Page>
  );
}

/** Static hosting friendly: the id comes from ?id= so every item works without a server. */
export default function PersonPage() {
  return (
    <Suspense fallback={null}>
      <PersonPageInner />
    </Suspense>
  );
}
