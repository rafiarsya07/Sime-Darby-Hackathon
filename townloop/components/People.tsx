"use client";

import Link from "next/link";
import { useState } from "react";
import { ArtTile } from "./Art";
import { LockedChatIcon, MessagesIcon } from "./Icons";
import { Sheet } from "./Sheet";
import { Avatar, Badge, Button, inputClass, LinkButton, Rating, TextField } from "./ui";
import { rm, timeAgo } from "@/lib/format";
import { useStore, whatsappLink } from "@/lib/store";
import type { ChatRequest, Post } from "@/lib/types";

/** Track record for anyone: average stars, jobs done, what they share. */
export function useTrackRecord(id: string) {
  const { state } = useStore();
  const reviews = state.reviews.filter((r) => r.aboutId === id);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.stars, 0) / reviews.length : 0;
  const done = state.bookings.filter((b) => b.providerId === id && b.status === "closed").length;
  const shares = state.listings.filter((l) => l.ownerId === id);
  const doneFromListings = shares.reduce((s, l) => s + l.done, 0);
  return { reviews, avg, done: Math.max(done, doneFromListings), shares };
}

/**
 * An incoming request, shown before any chat exists. The resident sees who
 * is asking, what they share and how they are rated, then decides.
 */
export function RequestCard({ r }: { r: ChatRequest }) {
  const { nameOf, user, state, answerRequest, listing } = useStore();
  const from = user(r.fromId);
  const { avg, reviews, done, shares } = useTrackRecord(r.fromId);
  const booking = r.bookingId ? state.bookings.find((b) => b.id === r.bookingId) : undefined;
  const post = r.postId ? state.posts.find((p) => p.id === r.postId) : undefined;
  const about = booking ? (listing(booking.listingId ?? "")?.title ?? booking.title) : post?.title;
  const name = nameOf(r.fromId);

  return (
    <article className="border-b border-line py-4 last:border-b-0">
      <p className="text-[12px] text-muted">
        {r.kind === "booking" ? "Wants to book" : "Replied to your post"} · {about} · {timeAgo(r.createdAt)}
      </p>
      <div className="mt-2 flex items-start gap-3">
        <Avatar name={name} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[15px] font-semibold">{name}</span>
            {from ? <Badge kind="verified" /> : null}
          </div>
          <p className="text-[13px] text-muted">
            {from?.street} · <Rating value={avg} count={reviews.length} /> · {done} done
          </p>
          {shares.length ? (
            <p className="mt-1 truncate text-[13px] text-ink-2">Shares: {shares.slice(0, 3).map((s) => s.title.split(",")[0]).join(", ")}</p>
          ) : null}
          <p className="mt-2 rounded-[10px] bg-surface px-3 py-2 text-[14px] leading-snug">
            {r.message}
            {r.offer !== undefined ? <span className="mt-1 block font-semibold">Offer: {r.offer ? rm(r.offer) : "Free"}</span> : null}
          </p>

          {r.status === "pending" ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => {
                  answerRequest(r.id, true);
                  // Live version: the WhatsApp Business API introduces both sides. Demo: a deep link.
                  window.open(whatsappLink(`Hi ${name}, it's about "${about}" on TownLoop. Accepted your request.`), "_blank", "noopener");
                }}
              >
                Accept and open WhatsApp
              </Button>
              <Button size="sm" variant="secondary" onClick={() => answerRequest(r.id, false)}>
                Decline
              </Button>
              <LinkButton size="sm" variant="quiet" href={`/person?id=${r.fromId}`}>
                View profile
              </LinkButton>
            </div>
          ) : r.status === "accepted" ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                href={whatsappLink(`Hi ${name}, it's about "${about}" on TownLoop.`)}
                target="_blank"
                rel="noreferrer"
                className="press inline-flex h-10 items-center gap-2 rounded-[10px] bg-ink px-4 text-[14px] font-semibold text-white"
              >
                <MessagesIcon size={18} /> Chat on WhatsApp
              </a>
              {r.bookingId ? (
                <Link href={`/booking?id=${r.bookingId}`} className="text-[14px] font-semibold underline underline-offset-2">
                  See booking
                </Link>
              ) : null}
            </div>
          ) : (
            <p className="mt-2 text-[13px] text-muted">Declined. They were not given your contact.</p>
          )}
        </div>
      </div>
    </article>
  );
}

/** Explains the chat policy wherever someone is about to send a request. */
export function ChatPolicy({ name }: { name: string }) {
  return (
    <p className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
      <LockedChatIcon size={18} className="mt-0.5 shrink-0" />
      {name} sees your profile first: what you share, your ratings and past jobs. WhatsApp opens only if they accept.
    </p>
  );
}

/** "Request to chat" on a wanted post. */
export function RespondSheet({ post, open, onClose }: { post: Post | null; open: boolean; onClose: () => void }) {
  const { respondToPost, nameOf } = useStore();
  const [message, setMessage] = useState("");
  const [offer, setOffer] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (!post) return null;
  const author = nameOf(post.authorId);

  function send() {
    if (!message.trim()) {
      setError("Say how you can help, so they know who you are.");
      return;
    }
    const n = offer === "" ? undefined : Number(offer);
    respondToPost(post!.id, message.trim(), Number.isNaN(n) ? undefined : n);
    setSent(true);
  }

  function close() {
    setMessage("");
    setOffer("");
    setError("");
    setSent(false);
    onClose();
  }

  return (
    <Sheet open={open} onClose={close} title={sent ? "Request sent" : `Reply to ${author}`}>
      {sent ? (
        <div>
          <p className="text-[15px] leading-relaxed text-ink-2">
            {author} will see your profile and your message. If they accept, TownLoop opens a WhatsApp chat between you.
          </p>
          <Button className="mt-5 w-full" onClick={close}>Done</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-[10px] bg-surface p-3">
            <ArtTile art={post.art} size={44} className="bg-white" />
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-semibold">{post.title}</span>
              <span className="text-[13px] text-muted">{post.when}{post.budget ? ` · up to ${rm(post.budget)}` : ""}</span>
            </span>
          </div>
          <TextField label="Your message" error={error}>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setError("");
              }}
              rows={3}
              placeholder={post.tier === "rent" ? "I have a navy one in size M, you can collect Friday night." : "I can do Saturday 3pm and bring my own tools."}
              className={`${inputClass(error)} h-auto py-3 leading-relaxed`}
            />
          </TextField>
          <TextField label="Your price" hint="Optional, leave empty to agree on chat">
            <span className={`flex h-12 items-center rounded-[10px] border border-line-strong px-3.5 focus-within:border-ink`}>
              <span className="mr-1.5 text-muted">RM</span>
              <input inputMode="decimal" value={offer} onChange={(e) => setOffer(e.target.value.replace(/[^\d.]/g, ""))} placeholder={post.budget ? String(post.budget) : "0"} className="min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
            </span>
          </TextField>
          <ChatPolicy name={author} />
          <Button className="w-full" onClick={send}>Send request</Button>
        </div>
      )}
    </Sheet>
  );
}
