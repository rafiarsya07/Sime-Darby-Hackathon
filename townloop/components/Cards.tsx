"use client";

import Link from "next/link";
import { ArtPhoto, ArtTile } from "./Art";
import { HeartIcon } from "./Icons";
import { Badge, Button, Rating } from "./ui";
import { vendorKindOf } from "@/lib/data";
import { distance, fmtDay, fmtDistance, rm, timeAgo, unitLabel } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Listing, Post } from "@/lib/types";

/**
 * Listing card: white block, photo with rating and owner chips, then
 * title, price in the display face and a night square save button.
 * `size="lg"` is the one column feed card on phones.
 */
export function ListingCard({ l, boosted = false, size = "md" }: { l: Listing; boosted?: boolean; size?: "md" | "lg" }) {
  const { me, user, vendor, state, toggleSave } = useStore();
  const resident = user(l.ownerId);
  const v = vendor(l.ownerId);
  const saved = state.saved.includes(l.id);
  const m = resident ? distance(me ?? undefined, resident) : 0;
  const kind = vendorKindOf(l);
  const owner = l.ownerId === me?.id ? "You" : (v?.name ?? resident?.name ?? "");
  const lg = size === "lg";

  return (
    <div className="group relative rounded-[24px] bg-white p-2 shadow-[0_1px_0_rgba(21,23,28,0.04)] transition-shadow hover:shadow-[0_16px_32px_-18px_rgba(21,23,28,0.35)]">
      <Link href={`/item?id=${l.id}`} className="block">
        <div className={`relative overflow-hidden rounded-[18px] bg-surface ${lg ? "aspect-[16/11]" : "aspect-square"}`}>
          <ArtPhoto art={l.art} w={lg ? 900 : 500} h={lg ? 620 : 500} alt={l.title} iconSize={64} />
          {l.rating ? (
            <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] leading-none font-semibold shadow-sm">
              <svg width="11" height="11" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.8l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.7l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z" fill="#FFB020" /></svg>
              {l.rating.toFixed(1)}
            </span>
          ) : null}
          <span className="absolute bottom-2 left-2 flex max-w-[calc(100%-1rem)] flex-wrap gap-1">
            {boosted ? <Badge kind="boost" /> : null}
            {kind ? <Badge kind={kind} className="bg-white text-ink shadow-sm" /> : null}
            {l.free ? <Badge kind="free" className="bg-white shadow-sm" /> : null}
            {l.facility ? <Badge kind="facility" className="bg-white shadow-sm" /> : null}
          </span>
        </div>
        <div className={lg ? "px-2.5 pt-3 pb-1.5" : "px-1.5 pt-2.5 pb-1"}>
          <p className={`line-clamp-2 leading-snug font-semibold ${lg ? "text-[17px]" : "text-[14px]"}`}>{l.title}</p>
          <p className={`mt-0.5 truncate text-muted ${lg ? "text-[13px]" : "text-[12px]"}`}>
            {owner}
            {m ? ` · ${fmtDistance(m)}` : v ? ` · ${v.area}` : ""}
          </p>
          <div className={`flex items-end justify-between gap-2 ${lg ? "mt-3 pr-12" : "mt-2 pr-10"}`}>
            <p className="min-w-0">
              <span className={`font-display font-semibold tracking-[-0.03em] ${lg ? "text-[20px]" : "text-[15px]"}`}>{l.free ? "Free" : rm(l.price)}</span>
              {!l.free ? <span className={`text-muted ${lg ? "text-[13px]" : "text-[11px]"}`}>/{unitLabel[l.unit]}</span> : null}
              {l.groupPrice ? (
                <span className={`mt-1 block w-fit rounded-full bg-sun-wash px-2 py-0.5 font-semibold text-ink ${lg ? "text-[12px]" : "text-[10px]"}`}>
                  {rm(l.groupPrice)} in a street group
                </span>
              ) : null}
            </p>
          </div>
        </div>
      </Link>
      <button
        onClick={() => toggleSave(l.id)}
        aria-label={saved ? `Remove ${l.title} from saved` : `Save ${l.title}`}
        aria-pressed={saved}
        className={`press absolute flex items-center justify-center rounded-[14px] ${saved ? "bg-ember text-white" : "bg-night text-white hover:bg-night-2"} ${lg ? "right-3 bottom-3 size-11" : "right-2.5 bottom-2.5 size-9"}`}
      >
        <HeartIcon size={lg ? 20 : 17} filled={false} />
      </button>
    </div>
  );
}

const TIER_WORD = { rent: "Wants to borrow", gigs: "Needs help", vendors: "Looking for a vendor" } as const;

/** A wanted post on the Posts board. */
export function PostCard({ p, onRespond }: { p: Post; onRespond?: () => void }) {
  const { me, user, state } = useStore();
  const author = user(p.authorId);
  const mine = p.authorId === me?.id;
  const replied = state.requests.some((r) => r.postId === p.id && r.fromId === me?.id);
  const replies = state.requests.filter((r) => r.postId === p.id).length;

  return (
    <article className="mb-3 rounded-[24px] bg-white p-4 shadow-[0_1px_0_rgba(21,23,28,0.04)]">
      <div className="flex gap-3.5">
        <ArtTile art={p.art} size={68} className="rounded-[18px]" />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-1.5 text-[12px] text-muted">
            <span className={`rounded-full px-2 py-0.5 font-semibold ${p.tier === "rent" ? "bg-sun-wash text-ink" : p.tier === "gigs" ? "bg-leaf-wash text-leaf-text" : "bg-ember-wash text-ember-text"}`}>{TIER_WORD[p.tier]}</span>
            {mine ? "You" : author?.name} · {timeAgo(p.createdAt)}
          </p>
          <Link href={`/post?id=${p.id}`} className="mt-0.5 block text-[15px] leading-snug font-semibold hover:underline">
            {p.title}
          </Link>
          <p className="mt-1 line-clamp-2 text-[14px] text-ink-2">{p.details}</p>
          <p className="mt-1.5 text-[13px] text-muted">
            {p.when} · {fmtDay(p.from)}
            {p.budget ? ` · up to ${rm(p.budget)}` : p.budget === 0 ? " · hoping to borrow free" : ""}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {mine ? (
              <Link href={`/post?id=${p.id}`} className="text-[14px] font-semibold underline underline-offset-2">
                {replies ? `${replies} ${replies === 1 ? "neighbour wants" : "neighbours want"} to chat` : "No replies yet"}
              </Link>
            ) : p.status !== "open" ? (
              <span className="text-[13px] text-muted">Matched with a neighbour</span>
            ) : replied ? (
              <span className="text-[13px] text-muted">Request sent. {author?.name} will see your profile first.</span>
            ) : onRespond ? (
              <Button size="sm" variant="accent" onClick={onRespond}>
                Request to chat
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
