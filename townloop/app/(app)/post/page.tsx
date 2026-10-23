"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArtTile } from "@/components/Art";
import { RequestCard, RespondSheet } from "@/components/People";
import { BackIcon } from "@/components/Icons";
import { Avatar, BackButton, Badge, Button, Empty, Page, SectionTitle } from "@/components/ui";
import { fmtDay, rm, timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";

const TIER_WORD = { rent: "Wants to borrow", gigs: "Needs help", vendors: "Looking for a vendor" } as const;

function PostPageInner() {
  const id = useSearchParams().get("id") ?? "";
  const router = useRouter();
  const { me, state, user } = useStore();
  const [open, setOpen] = useState(false);
  const p = state.posts.find((x) => x.id === id);

  if (!p || !me) {
    return (
      <Page>
        <Empty title="This post is gone">
          <Link href="/posts" className="font-semibold text-ink underline">All posts</Link>
        </Empty>
      </Page>
    );
  }

  const author = user(p.authorId);
  const mine = p.authorId === me.id;
  const replies = state.requests.filter((r) => r.postId === p.id);
  const myReply = replies.find((r) => r.fromId === me.id);

  return (
    <Page>
      <BackButton onClick={() => router.back()} />

      <div className="mt-2 flex gap-4">
        <ArtTile art={p.art} size={64} />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-[12px] text-muted"><span className="rounded-full bg-sun-wash px-2 py-0.5 font-semibold text-ink">{TIER_WORD[p.tier]}</span>{timeAgo(p.createdAt)}</p>
          <h1 className="mt-0.5 text-[22px] leading-tight font-semibold tracking-[-0.02em]">{p.title}</h1>
        </div>
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{p.details}</p>
      <dl className="mt-4 text-[15px]">
        <div className="flex justify-between border-y border-line py-3"><dt className="text-muted">When</dt><dd className="font-medium">{p.when}, from {fmtDay(p.from)}</dd></div>
        <div className="flex justify-between border-b border-line py-3"><dt className="text-muted">Budget</dt><dd className="font-medium">{p.budget ? `Up to ${rm(p.budget)}` : "Hoping to borrow free"}</dd></div>
      </dl>

      <div className="mt-5 flex items-center gap-3">
        <Avatar name={author?.name ?? "?"} />
        <span className="flex-1">
          <span className="flex items-center gap-2 text-[15px] font-semibold">{mine ? "You" : author?.name} <Badge kind="verified" /></span>
          <span className="text-[13px] text-muted">{author?.street}</span>
        </span>
      </div>

      {mine ? (
        <>
          <SectionTitle>{replies.length ? `Neighbours who can help (${replies.length})` : "No replies yet"}</SectionTitle>
          {replies.length ? (
            <>
              <p className="mb-3 text-[13px] text-muted">Accepting opens WhatsApp with that person only.</p>
              {replies.map((r) => <RequestCard key={r.id} r={r} />)}
            </>
          ) : (
            <p className="rounded-[24px] bg-white px-4 py-5 text-[14px] text-muted">Replies show up here and on Me.</p>
          )}
        </>
      ) : p.status !== "open" ? (
        <p className="mt-6 text-[14px] text-muted">{author?.name} already found someone.</p>
      ) : myReply ? (
        <p className="mt-6 rounded-[20px] bg-leaf-wash px-4 py-3.5 text-[14px] font-medium text-leaf-text">
          {myReply.status === "accepted" ? "Accepted. Find it in Bookings." : `Request sent. ${author?.name} decides next.`}
        </p>
      ) : (
        <Button variant="accent" size="lg" className="mt-6 w-full" onClick={() => setOpen(true)}>Request to chat with {author?.name}</Button>
      )}

      <RespondSheet post={open ? p : null} open={open} onClose={() => setOpen(false)} />
    </Page>
  );
}

/** Static hosting friendly: the id comes from ?id= so every item works without a server. */
export default function PostPage() {
  return (
    <Suspense fallback={null}>
      <PostPageInner />
    </Suspense>
  );
}
