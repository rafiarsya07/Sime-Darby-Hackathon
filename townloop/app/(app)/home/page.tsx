"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ListingCard, PostCard } from "@/components/Cards";
import { ArtTile } from "@/components/Art";
import { ForecastCard } from "@/components/Forecast";
import { RespondSheet } from "@/components/People";
import { AlertsIcon, ArrowRightIcon, FilterIcon, GroupBuyIcon, JetWasherIcon, LendAHandIcon, LoopIcon, PostIcon, SearchIcon, ShopIcon } from "@/components/Icons";
import { Avatar, Empty, MoreLink, Page, SectionTitle } from "@/components/ui";
import { CATEGORIES, vendorKindOf } from "@/lib/data";
import { distance, fmtDay, rm } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Listing, Post, Tier } from "@/lib/types";

type Tab = "foryou" | Tier;

const TABS: { id: Tab; label: string }[] = [
  { id: "foryou", label: "For you" },
  { id: "rent", label: "Rent" },
  { id: "gigs", label: "Gigs" },
  { id: "vendors", label: "Vendors" },
];

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">{children}</div>
);

/** One big card per row on phones, like a feed. */
const FeedGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">{children}</div>
);

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export default function HomePage() {
  const { me, state, user, nameOf } = useStore();
  const [tab, setTab] = useState<Tab>("foryou");
  const [cat, setCat] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [replyTo, setReplyTo] = useState<Post | null>(null);

  const near = (l: Listing) => distance(me ?? undefined, user(l.ownerId));

  /**
   * Default recommendations before any search. Vendors get the biggest
   * boost (local above outside), resident providers a smaller one, and
   * everything is nudged by rating, track record and distance.
   */
  const forYou = useMemo(() => {
    const score = (l: Listing) => {
      const kind = vendorKindOf(l);
      const boost = kind === "local" ? 40 : kind === "outside" ? 25 : 10;
      return boost + l.rating * 8 + Math.log10(1 + l.done) * 6 - near(l) / 100;
    };
    return state.listings.filter((l) => l.ownerId !== me?.id).sort((a, b) => score(b) - score(a));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.listings, me]);

  const tierList = useMemo(() => {
    if (tab === "foryou") return [];
    return state.listings
      .filter((l) => l.tier === tab && (!cat || l.category === cat))
      .sort((a, b) => {
        if (tab === "vendors") {
          const ka = vendorKindOf(a) === "local" ? 0 : 1;
          const kb = vendorKindOf(b) === "local" ? 0 : 1;
          return ka - kb || b.rating - a.rating;
        }
        return near(a) - near(b);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.listings, tab, cat, me]);

  const q = query.trim().toLowerCase();
  const results = q
    ? state.listings.filter((l) => `${l.title} ${l.category}`.toLowerCase().includes(q))
    : [];
  const postResults = q ? state.posts.filter((p) => p.status === "open" && `${p.title} ${p.details}`.toLowerCase().includes(q)) : [];

  const openPosts = state.posts.filter((p) => p.status === "open" && p.authorId !== me?.id);
  const pendingReqs = state.requests.filter((r) => r.toId === me?.id && r.status === "pending");
  const pending = pendingReqs.length;

  if (!me) return null;

  const TILES: { id: Tab; label: string; Icon: (p: { size?: number }) => React.ReactNode; tint: string }[] = [
    { id: "foryou", label: "For you", Icon: LoopIcon, tint: "bg-surface" },
    { id: "rent", label: "Rent", Icon: JetWasherIcon, tint: "bg-sun-wash" },
    { id: "gigs", label: "Gigs", Icon: LendAHandIcon, tint: "bg-leaf-wash" },
    { id: "vendors", label: "Vendors", Icon: ShopIcon, tint: "bg-ember-wash" },
  ];
  const aircond = state.listings.find((l) => l.id === "aircond");

  return (
    <Page wide>
      {/* Greeting */}
      <div className="flex items-center gap-3">
        <Avatar name={me.name} size={52} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] text-muted">{greeting()}</p>
          <h1 className="font-display text-[22px] leading-tight font-semibold tracking-[-0.03em] sm:text-[26px]">Hi, {me.name.split(" ").pop()}</h1>
        </div>
        <Link href="/me" aria-label={pending ? `${pending} new requests` : "Notifications"} className="press relative flex size-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_1px_0_rgba(21,23,28,0.05)]">
          <AlertsIcon size={21} />
          {pending ? <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-ember text-[10px] font-bold text-white ring-2 ring-canvas">{pending}</span> : null}
        </Link>
      </div>

      {/* Search */}
      <div className="mt-5 flex items-center gap-2 lg:max-w-2xl">
        <label className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-full bg-white pr-2 pl-5 shadow-[0_1px_0_rgba(21,23,28,0.05)] focus-within:ring-2 focus-within:ring-ember/30">
          <SearchIcon size={19} className="text-muted" />
          <span className="sr-only">Search TownLoop</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jet washer, tuition, aircond…"
            className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
        </label>
        <Link href="/posts/new" aria-label="Post what you need" className="press flex size-14 shrink-0 items-center justify-center rounded-full bg-night text-white">
          <FilterIcon size={20} />
        </Link>
      </div>

      {pending ? (
        <Link href="/me" className="press mt-3 flex items-center gap-3 rounded-[22px] bg-night py-3 pr-3 pl-3 text-white lg:max-w-2xl">
          <span className="flex -space-x-3">
            {pendingReqs.slice(0, 3).map((r) => (
              <span key={r.id} className="rounded-full ring-2 ring-night"><Avatar name={nameOf(r.fromId)} size={36} /></span>
            ))}
          </span>
          <span className="min-w-0 flex-1 text-[14px] leading-snug">
            <span className="block font-semibold">{pending} {pending === 1 ? "neighbour wants" : "neighbours want"} to chat</span>
            <span className="block text-[12px] text-white/60">Review before you accept</span>
          </span>
          <span className="flex size-10 items-center justify-center rounded-full bg-ember"><ArrowRightIcon size={18} /></span>
        </Link>
      ) : null}

      {q ? (
        <>
          <SectionTitle>Results for “{query}”</SectionTitle>
          {results.length ? (
            <Grid>{results.map((l) => <ListingCard key={l.id} l={l} />)}</Grid>
          ) : (
            <Empty title="Nobody is offering that yet">
              <Link href="/posts/new" className="font-semibold text-ink underline underline-offset-2">Post a request</Link> and neighbours who have one can reply.
            </Empty>
          )}
          {postResults.length ? (
            <>
              <SectionTitle>Neighbours asking for this</SectionTitle>
              {postResults.map((p) => <PostCard key={p.id} p={p} onRespond={() => setReplyTo(p)} />)}
            </>
          ) : null}
        </>
      ) : (
        <>
          {tab === "foryou" ? (
            /* Colour block promos */
            <div className="mt-5 grid grid-cols-2 gap-3 lg:max-w-2xl">
              <button onClick={() => { setTab("vendors"); setCat(null); }} className="press relative h-[148px] overflow-hidden rounded-[24px] bg-sun p-4 text-left text-ink">
                <span className="relative z-10 block font-display text-[11px] leading-tight font-semibold tracking-[0.03em] uppercase">Street<br />group buys</span>
                <span className="relative z-10 mt-2 block font-display text-[26px] font-bold tracking-[-0.04em]">{aircond?.groupPrice ? rm(aircond.groupPrice) : "Save"}</span>
                <span className="relative z-10 block text-[12px] text-ink/70">aircond wash</span>
                <span className="absolute right-3 bottom-3 z-10 flex size-10 items-center justify-center rounded-full bg-night text-white"><ArrowRightIcon size={18} /></span>
              </button>
              <Link href="/posts/new" className="press relative h-[148px] overflow-hidden rounded-[24px] bg-ember p-4 text-white">
                <span className="relative z-10 block font-display text-[11px] leading-tight font-semibold tracking-[0.03em] uppercase">Need<br />something?</span>
                <span className="relative z-10 mt-2 block font-display text-[19px] leading-[1.1] font-bold tracking-[-0.03em]">Post a<br />request</span>
                <span className="absolute right-3 bottom-3 z-10 flex size-10 items-center justify-center rounded-full bg-white text-ink"><ArrowRightIcon size={18} /></span>
              </Link>
            </div>
          ) : null}

          {/* Category tiles double as tabs */}
          <SectionTitle action={<MoreLink href="/posts">Posts</MoreLink>}>Browse</SectionTitle>
          <div role="tablist" aria-label="Browse" className="grid grid-cols-4 gap-2.5 sm:flex">
            {TILES.map(({ id, label, Icon, tint }) => {
              const on = tab === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => { setTab(id); setCat(null); }}
                  className={`press flex min-w-0 flex-col items-center gap-2 rounded-[22px] p-2 pb-3 text-[12px] font-semibold transition-colors sm:w-[92px] ${on ? "bg-night text-white" : "bg-white text-ink"}`}
                >
                  <span className={`flex aspect-square w-full max-w-[60px] items-center justify-center rounded-[18px] ${on ? "bg-white/10" : tint}`}>
                    <Icon size={28} />
                  </span>
                  {label}
                </button>
              );
            })}
          </div>

          {tab !== "foryou" ? (
            <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              {[null, ...CATEGORIES[tab]].map((c) => (
                <button
                  key={c ?? "all"}
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${cat === c ? "bg-ember text-white" : "bg-white text-ink hover:bg-surface"}`}
                >
                  {c ?? "All"}
                </button>
              ))}
            </div>
          ) : null}

          {tab === "foryou" ? (
            <>
              {openPosts.length ? (
                <>
                  <SectionTitle action={<MoreLink href="/posts" />}>Neighbours are asking</SectionTitle>
                  <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-2 lg:overflow-visible">
                    {openPosts.slice(0, 4).map((p) => (
                      <div key={p.id} className="w-[86%] shrink-0 snap-start sm:w-[420px] lg:w-auto">
                        <PostCard p={p} onRespond={() => setReplyTo(p)} />
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
              <SectionTitle action={<button onClick={() => setTab("rent")} className="rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold hover:bg-surface">See all</button>}>
                Popular near you
              </SectionTitle>
              <FeedGrid>
                {forYou.slice(0, 6).map((l) => <ListingCard key={l.id} l={l} size="lg" boosted={l.tier === "vendors" && l.rating >= 4.7} />)}
              </FeedGrid>
              <GroupBuys />
              <SectionTitle>More from your street</SectionTitle>
              <Grid>{forYou.slice(6).map((l) => <ListingCard key={l.id} l={l} />)}</Grid>
            </>
          ) : (
            <>
              {tab === "vendors" ? (
                <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <ForecastCard />
                  <GroupBuys inline />
                </div>
              ) : null}
              {tab === "gigs" ? (
                <p className="mt-4 text-[14px] text-muted">
                  Can&apos;t find it? <Link href="/posts/new" className="font-semibold text-ink underline underline-offset-2">Post what you need</Link>
                </p>
              ) : null}
              <div className="mt-5">
                {tierList.length ? <Grid>{tierList.map((l) => <ListingCard key={l.id} l={l} />)}</Grid> : <Empty title="Nothing here yet" />}
              </div>
            </>
          )}
        </>
      )}

      <RespondSheet post={replyTo} open={!!replyTo} onClose={() => setReplyTo(null)} />
    </Page>
  );
}

/** Street group buys: the more homes join, the cheaper the vendor visit. */
function GroupBuys({ inline = false }: { inline?: boolean }) {
  const { state, listing, me } = useStore();
  if (!state.groups.length) return null;
  const body = (
    <ul className={inline ? "grid grid-cols-1 gap-2" : "grid grid-cols-1 gap-2 lg:grid-cols-2"}>
      {state.groups.map((g) => {
        const l = listing(g.listingId);
        if (!l) return null;
        const joined = me ? g.joined.includes(me.id) : false;
        const pct = Math.min(100, (g.joined.length / g.target) * 100);
        return (
          <li key={g.id}>
            <Link href={`/item?id=${l.id}`} className="press flex min-w-0 items-center gap-3 rounded-[20px] bg-white p-2.5 pr-3.5 hover:bg-white/80">
              <ArtTile art={l.art} size={60} className="rounded-[16px]" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold">{l.title}</span>
                <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted">
                  <span>{g.joined.length} of {g.target} homes</span>
                  <span>{fmtDay(g.date)}</span>
                  {joined ? <span className="rounded-full bg-leaf-wash px-2 py-0.5 font-semibold text-leaf-text">Joined</span> : null}
                </span>
                <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-sun-wash">
                  <span className="block h-full rounded-full bg-sun" style={{ width: `${pct}%` }} />
                </span>
              </span>
              <span className="shrink-0 text-right whitespace-nowrap">
                <span className="block font-display text-[14px] font-semibold tracking-[-0.03em]">{rm(l.groupPrice ?? l.price)}</span>
                <span className="block text-[11px] text-muted line-through">{rm(l.price)}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
  if (inline) {
    return (
      <section className="rounded-[24px] bg-sun-wash p-3">
        <h2 className="flex items-center gap-2 px-1 pt-1 pb-2.5 font-display text-[12px] font-semibold tracking-[0.02em] uppercase"><GroupBuyIcon size={20} /> Group buys on your street</h2>
        {body}
      </section>
    );
  }
  return (
    <>
      <SectionTitle>Group buys on your street</SectionTitle>
      <div className="rounded-[26px] bg-sun-wash p-2.5">{body}</div>
    </>
  );
}
