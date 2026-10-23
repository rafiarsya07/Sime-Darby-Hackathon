"use client";

import Link from "next/link";
import { ArtIcon } from "./Art";
import { HeartIcon } from "./Icons";
import { Avatar, Badge, Button, Rating } from "./ui";
import { vendorKindOf } from "@/lib/data";
import { distance, fmtDay, fmtDistance, rm, timeAgo, unitLabel } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Listing, Post } from "@/lib/types";

/** Carousell style card: picture first, then price, then who and how far. */
export function ListingCard({ l, boosted = false }: { l: Listing; boosted?: boolean }) {
  const { me, user, vendor, state, toggleSave } = useStore();
  const resident = user(l.ownerId);
  const v = vendor(l.ownerId);
  const saved = state.saved.includes(l.id);
  const m = resident ? distance(me ?? undefined, resident) : 0;
  const kind = vendorKindOf(l);

  return (
    <div className="group relative">
      <Link href={`/item?id=${l.id}`} className="block">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[12px] bg-surface text-ink transition-colors group-hover:bg-[#EEEEEB]">
          <span className={boosted || kind || l.free || l.facility ? "pt-8" : ""}>
            <ArtIcon art={l.art} size={64} />
          </span>
          <span className="absolute top-2 right-12 left-2 flex flex-col items-start gap-1">
            {boosted ? <Badge kind="boost" /> : null}
            {l.free ? <Badge kind="free" /> : null}
            {l.facility ? <Badge kind="facility" /> : null}
            {kind ? <Badge kind={kind} /> : null}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[12px] text-muted">
          <Avatar name={resident?.name ?? v?.name ?? "?"} size={18} vendor={!!v} />
          <span className="truncate">{l.ownerId === me?.id ? "You" : (resident?.name ?? v?.name)}</span>
          {m ? <span className="shrink-0">· {fmtDistance(m)}</span> : null}
        </div>
        <p className="mt-1 line-clamp-2 text-[14px] leading-snug font-medium">{l.title}</p>
        <p className="mt-1 text-[15px] font-semibold">
          {l.free ? "Free" : rm(l.price)}
          {!l.free ? <span className="text-[12px] font-normal text-muted">/{unitLabel[l.unit]}</span> : null}
          {l.groupPrice ? <span className="ml-1.5 text-[12px] font-medium text-ember-text">{rm(l.groupPrice)} in a group</span> : null}
        </p>
        <Rating value={l.rating} count={l.reviews} className="mt-0.5 text-[12px]" />
      </Link>
      <button
        onClick={() => toggleSave(l.id)}
        aria-label={saved ? `Remove ${l.title} from saved` : `Save ${l.title}`}
        aria-pressed={saved}
        className="absolute top-1.5 right-1.5 flex size-9 items-center justify-center rounded-full bg-white/90 text-ink hover:bg-white"
      >
        <HeartIcon size={18} filled={saved} />
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
    <article className="border-b border-line py-4">
      <div className="flex gap-3.5">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-[10px] bg-surface">
          <ArtIcon art={p.art} size={28} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-muted">
            {TIER_WORD[p.tier]} · {mine ? "You" : author?.name} · {timeAgo(p.createdAt)}
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
              <Button size="sm" variant="secondary" onClick={onRespond}>
                Request to chat
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
