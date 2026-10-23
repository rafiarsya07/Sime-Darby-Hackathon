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
 * Listing card: big photo with the owner chip, kind chip and save heart on
 * top, then title, stars, price. `size="lg"` is the one column feed card.
 */
export function ListingCard({ l, boosted = false, size = "md" }: { l: Listing; boosted?: boolean; size?: "md" | "lg" }) {
  const { me, user, vendor, state, toggleSave } = useStore();
  const resident = user(l.ownerId);
  const v = vendor(l.ownerId);
  const saved = state.saved.includes(l.id);
  const m = resident ? distance(me ?? undefined, resident) : 0;
  const kind = vendorKindOf(l);
  const owner = l.ownerId === me?.id ? "You" : (v?.name.split(" ")[0] ?? resident?.name ?? "");
  const lg = size === "lg";

  return (
    <div className="group relative overflow-hidden rounded-[16px] border border-line bg-white transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)]">
      <Link href={`/item?id=${l.id}`} className="block">
        <div className={`relative overflow-hidden bg-surface ${lg ? "aspect-[16/11]" : "aspect-[4/3]"}`}>
          <ArtPhoto art={l.art} w={lg ? 900 : 600} h={lg ? 620 : 450} alt={l.title} iconSize={64} />
          <span className="absolute top-2.5 left-2.5 max-w-[60%] truncate rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            {owner}
          </span>
          <span className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1">
            {boosted ? <Badge kind="boost" /> : null}
            {kind ? <Badge kind={kind} className="bg-white text-ink shadow-sm" /> : null}
            {l.free ? <Badge kind="free" className="bg-white shadow-sm" /> : null}
            {l.facility ? <Badge kind="facility" className="bg-white shadow-sm" /> : null}
          </span>
        </div>
        <div className={lg ? "px-4 pt-3.5 pb-4" : "px-3 pt-2.5 pb-3"}>
          <p className={`line-clamp-2 leading-snug font-semibold ${lg ? "text-[17px]" : "text-[14px]"}`}>{l.title}</p>
          <Rating value={l.rating} count={l.reviews} stars className={`mt-1 ${lg ? "text-[13px]" : "text-[12px]"}`} />
          <p className={`mt-1.5 font-semibold tracking-[-0.01em] ${lg ? "text-[20px]" : "text-[16px]"}`}>
            {l.free ? "Free" : rm(l.price)}
            {!l.free ? <span className={`font-normal text-muted ${lg ? "text-[14px]" : "text-[12px]"}`}>/{unitLabel[l.unit]}</span> : null}
          </p>
          {l.groupPrice ? (
            <p className={`text-ember-text ${lg ? "text-[13px]" : "text-[12px]"} font-medium`}>{rm(l.groupPrice)} in a street group</p>
          ) : (
            <p className={`truncate text-muted ${lg ? "text-[13px]" : "text-[12px]"}`}>{m ? `${fmtDistance(m)} away` : v ? v.area : l.category}</p>
          )}
        </div>
      </Link>
      <button
        onClick={() => toggleSave(l.id)}
        aria-label={saved ? `Remove ${l.title} from saved` : `Save ${l.title}`}
        aria-pressed={saved}
        className="press absolute top-2 right-2 flex size-9 items-center justify-center rounded-full bg-white text-ink shadow-sm hover:bg-white"
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
    <article className="mb-3 rounded-[16px] border border-line bg-white p-4">
      <div className="flex gap-3.5">
        <ArtTile art={p.art} size={64} />
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
