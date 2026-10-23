"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArtTile } from "@/components/Art";
import { ListingCard } from "@/components/Cards";
import { ChevronRightIcon, EcoPointsIcon } from "@/components/Icons";
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
      <div className="flex items-center gap-4">
        <Avatar name={me.name} size={64} />
        <div className="min-w-0 flex-1">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">{me.name}</h1>
          <p className="text-[14px] text-muted">{me.street} · {me.phase}</p>
          <Badge kind="verified" className="mt-1.5" />
        </div>
        <Link href={`/person?id=${me.id}`} className="text-[14px] font-medium underline underline-offset-4">Public profile</Link>
      </div>

      <Link href="/me/points" className="mt-6 flex items-center gap-4 rounded-[12px] border border-line px-4 py-4 hover:border-line-strong">
        <EcoPointsIcon size={36} />
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] text-muted">Eco points</span>
          <span className="block text-[24px] leading-tight font-semibold tabular-nums">{fmtPoints(pts)}</span>
          {next ? (
            <span className="mt-2 block">
              <span className="block h-1.5 overflow-hidden rounded-full bg-surface">
                <span className="block h-full rounded-full bg-ember" style={{ width: `${Math.min(100, (pts / next.cost) * 100)}%` }} />
              </span>
              <span className="mt-1 block text-[12px] text-muted">{fmtPoints(next.cost - pts)} to {next.title}</span>
            </span>
          ) : null}
        </span>
        <ChevronRightIcon size={18} className="text-muted" />
      </Link>

      <SectionTitle>
        <span className="flex items-center gap-2">
          Requests for you {incoming.length ? <span className="rounded-full bg-ember px-2 py-0.5 text-[12px] text-white">{incoming.length}</span> : null}
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
          <ul>
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
          <ul>
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
            className="flex items-center gap-3 rounded-[10px] border border-line-strong px-3.5 py-3 text-left hover:border-ink disabled:border-ink disabled:bg-surface"
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
