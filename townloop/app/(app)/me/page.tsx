"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArtTile } from "@/components/Art";
import { ListingCard } from "@/components/Cards";
import { ChevronRightIcon, ShareIcon } from "@/components/Icons";
import { EcoCard } from "@/components/EcoCard";
import { coverPhoto } from "@/lib/photos";
import { RequestCard } from "@/components/People";
import { Avatar, Badge, Button, LinkButton, Page, SectionTitle } from "@/components/ui";
import { DEMO_ACCOUNTS, REWARDS } from "@/lib/data";
import { fmtPoints, timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function MePage() {
  const router = useRouter();
  const { me, state, balance, nameOf, signIn, signOut, resetDemo, listing } = useStore();
  if (!me) return null;

  const pts = balance(me.id);
  const next = REWARDS.filter((r) => r.id !== "donate").sort((a, b) => a.cost - b.cost).find((r) => r.cost > pts);
  const incoming = state.requests.filter((r) => r.toId === me.id && r.status === "pending");
  const sent = state.requests.filter((r) => r.fromId === me.id).slice(0, 5);
  const mine = state.listings.filter((l) => l.ownerId === me.id);
  const posts = state.posts.filter((p) => p.authorId === me.id && p.status !== "closed");
  const saved = state.saved.map((id) => listing(id)).filter((l) => !!l);

  return (
    <Page>
      {/* Cover with the avatar overlapping it */}
      <div className="relative">
        <div className="relative h-36 overflow-hidden rounded-[28px] bg-sun sm:h-44">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverPhoto()} alt="" className="absolute inset-0 size-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-t from-night/40 to-transparent" />
          <Link href={`/person?id=${me.id}`} aria-label="Public profile" className="press absolute top-3 right-3 flex size-11 items-center justify-center rounded-full bg-night/60 text-white backdrop-blur-md">
            <ShareIcon size={19} />
          </Link>
        </div>
        <span className="absolute -bottom-10 left-4 rounded-full ring-[5px] ring-canvas">
          <Avatar name={me.name} size={88} />
        </span>
      </div>
      <div className="mt-12 flex items-end justify-between gap-3 px-1">
        <div className="min-w-0">
          <h1 className="font-display text-[22px] font-semibold tracking-[-0.03em]">{me.name}</h1>
          <p className="mt-0.5 text-[13px] text-muted">{me.street} · {me.phase}</p>
        </div>
        <Badge kind="verified" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          ["Listings", mine.length],
          ["Posts", posts.length],
          ["Saved", saved.length],
        ].map(([k, n]) => (
          <div key={k} className="rounded-[20px] bg-white py-3">
            <p className="font-display text-[18px] font-semibold tracking-[-0.03em]">{n}</p>
            <p className="text-[12px] text-muted">{k}</p>
          </div>
        ))}
      </div>

      <Link href="/me/points" className="press mt-4 block">
        <EcoCard name={me.name} points={pts} since={me.since} next={next} />
      </Link>

      <SectionTitle>
        <span className="flex items-center gap-2">
          Requests for you {incoming.length ? <span className="rounded-full bg-ember px-2 py-0.5 font-sans text-[12px] text-white">{incoming.length}</span> : null}
        </span>
      </SectionTitle>
      {incoming.length ? (
        <>
          <p className="text-[13px] text-muted">Check who is asking before you accept. WhatsApp only opens after you say yes.</p>
          {incoming.map((r) => <RequestCard key={r.id} r={r} />)}
        </>
      ) : (
        <p className="text-[14px] text-muted">Nothing waiting. When someone books your listing or answers your post, they show up here.</p>
      )}

      {sent.length ? (
        <>
          <SectionTitle>Requests you sent</SectionTitle>
          <ul className="rounded-[24px] bg-white px-4">
            {sent.map((r) => {
              const href = r.bookingId ? `/booking?id=${r.bookingId}` : `/post?id=${r.postId}`;
              const about = r.postId ? state.posts.find((p) => p.id === r.postId)?.title : state.bookings.find((b) => b.id === r.bookingId)?.title.split(",")[0];
              return (
                <li key={r.id} className="border-b border-line last:border-b-0">
                  <Link href={href} className="flex items-center justify-between gap-3 py-3 text-[14px]">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{about}</span>
                      <span className="block text-[13px] text-muted">To {nameOf(r.toId)} · {timeAgo(r.createdAt)}</span>
                    </span>
                    <span className={`shrink-0 text-[13px] ${r.status === "accepted" ? "font-semibold text-ember-text" : "text-muted"}`}>
                      {r.status === "pending" ? "Waiting" : r.status === "accepted" ? "Accepted" : "Declined"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}

      <SectionTitle action={<Link href="/list" className="text-[14px] font-medium underline underline-offset-4">Add</Link>}>Your listings</SectionTitle>
      {mine.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3">{mine.map((l) => <ListingCard key={l.id} l={l} />)}</div>
      ) : (
        <p className="text-[14px] text-muted">You haven&apos;t listed anything yet. Your first listing earns 100 points.</p>
      )}

      {posts.length ? (
        <>
          <SectionTitle>Your posts</SectionTitle>
          <ul className="rounded-[24px] bg-white px-3">
            {posts.map((p) => {
              const replies = state.requests.filter((r) => r.postId === p.id && r.status === "pending").length;
              return (
                <li key={p.id} className="border-b border-line last:border-b-0">
                  <Link href={`/post?id=${p.id}`} className="flex items-center gap-3 py-3">
                    <ArtTile art={p.art} size={44} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium">{p.title}</span>
                      <span className="block text-[13px] text-muted">{p.status === "matched" ? "Matched" : replies ? `${replies} waiting for you` : "No replies yet"}</span>
                    </span>
                    <ChevronRightIcon size={18} className="text-muted" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}

      {saved.length ? (
        <>
          <SectionTitle>Saved</SectionTitle>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3">{saved.map((l) => <ListingCard key={l!.id} l={l!} />)}</div>
        </>
      ) : null}

      <SectionTitle>Demo</SectionTitle>
      <p className="text-[13px] text-muted">Switch person to see the other side of a request.</p>
      <div className="mt-3 grid gap-2">
        {DEMO_ACCOUNTS.map((a) => (
          <button
            key={a.id}
            onClick={() => { signIn(a.id); router.push("/home"); }}
            disabled={a.id === me.id}
            className="press flex items-center gap-3 rounded-[20px] border-2 border-transparent bg-white px-3 py-2.5 text-left hover:border-line-strong disabled:border-night"
          >
            <Avatar name={nameOf(a.id)} size={34} />
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold">{nameOf(a.id)}{a.id === me.id ? " (you)" : ""}</span>
              <span className="block truncate text-[13px] text-muted">{a.note}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => { resetDemo(); router.push("/home"); }}>Reset demo data</Button>
        <Button variant="quiet" size="sm" onClick={() => { signOut(); router.push("/signin"); }}>Sign out</Button>
        <LinkButton href="/" variant="quiet" size="sm">About TownLoop</LinkButton>
      </div>
    </Page>
  );
}
