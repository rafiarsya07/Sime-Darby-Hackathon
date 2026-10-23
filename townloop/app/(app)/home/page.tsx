"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ListingCard, PostCard } from "@/components/Cards";
import { ArtTile } from "@/components/Art";
import { ForecastCard } from "@/components/Forecast";
import { RespondSheet } from "@/components/People";
import { AlertsIcon, ChevronRightIcon, JetWasherIcon, LendAHandIcon, PostIcon, SearchIcon, ShopIcon } from "@/components/Icons";
import { Avatar, Dot, Empty, Page, SectionTitle } from "@/components/ui";
import { CATEGORIES, vendorKindOf } from "@/lib/data";
import { distance, fmtDay, fmtPoints, rm } from "@/lib/format";
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
  const { me, state, user, balance } = useStore();
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
  const pending = state.requests.filter((r) => r.toId === me?.id && r.status === "pending").length;

  if (!me) return null;

  return (
    <Page wide>
      <p className="text-[13px] text-muted">For residents of {me.precinct}</p>
      <div className="mt-2 flex items-center gap-3">
        <Avatar name={me.name} size={48} />
        <h1 className="min-w-0 flex-1 text-[21px] leading-tight font-semibold tracking-[-0.02em] sm:text-[24px]">
          {greeting()}, {me.name.split(" ").pop()}
        </h1>
        <Link href="/me" aria-label={pending ? `${pending} new requests` : "Notifications"} className="press relative flex size-11 shrink-0 items-center justify-center rounded-full border border-line hover:border-line-strong">
          <AlertsIcon size={20} />
          {pending ? <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-ember ring-2 ring-white" /> : null}
        </Link>
      </div>

      <label className="mt-4 flex h-12 items-center gap-2.5 rounded-[12px] bg-surface px-3.5 focus-within:ring-2 focus-within:ring-ink/10 lg:max-w-2xl">
        <SearchIcon size={18} className="text-muted" />
        <span className="sr-only">Search TownLoop</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jet washer, tuition, aircond…"
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
        />
      </label>

      {pending ? (
        <Link href="/me" className="mt-3 flex items-center gap-3 rounded-[14px] bg-ember-wash px-4 py-3 text-[14px] hover:bg-[#FFEADD] lg:max-w-2xl">
          <Dot />
          <span className="flex-1">
            <span className="font-semibold">{pending} {pending === 1 ? "neighbour wants" : "neighbours want"} to chat.</span>{" "}
            <span className="text-muted">Check their profile before you accept.</span>
          </span>
          <ChevronRightIcon size={18} className="text-muted" />
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
          <div role="tablist" aria-label="Browse" className="-mx-4 mt-4 flex gap-5 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => {
                  setTab(t.id);
                  setCat(null);
                }}
                className={`-mb-px shrink-0 border-b-2 py-2.5 text-[15px] ${tab === t.id ? "border-ink font-semibold text-ink" : "border-transparent font-medium text-muted hover:text-ink"}`}
              >
                {t.label}
              </button>
            ))}
            <Link href="/posts" className="shrink-0 py-2.5 text-[15px] font-medium text-muted hover:text-ink">
              Posts
            </Link>
          </div>

          {tab !== "foryou" ? (
            <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              {[null, ...CATEGORIES[tab]].map((c) => (
                <button
                  key={c ?? "all"}
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] ${cat === c ? "border-ink bg-ink font-medium text-white" : "border-line-strong hover:border-ink"}`}
                >
                  {c ?? "All"}
                </button>
              ))}
            </div>
          ) : null}

          {tab === "foryou" ? (
            <>
              <div className="mt-5 grid grid-cols-4 gap-2.5 sm:max-w-md">
                {[
                  { label: "Rent", Icon: JetWasherIcon, go: () => setTab("rent") },
                  { label: "Gigs", Icon: LendAHandIcon, go: () => setTab("gigs") },
                  { label: "Vendors", Icon: ShopIcon, go: () => setTab("vendors") },
                ].map(({ label, Icon, go }) => (
                  <button key={label} onClick={go} className="press flex flex-col items-center gap-1.5 rounded-[14px] bg-surface py-3 text-[13px] font-medium hover:bg-[#EEEEEA]">
                    <Icon size={26} />
                    {label}
                  </button>
                ))}
                <Link href="/posts" className="press flex flex-col items-center gap-1.5 rounded-[14px] bg-surface py-3 text-[13px] font-medium hover:bg-[#EEEEEA]">
                  <PostIcon size={26} />
                  Posts
                </Link>
              </div>
              {openPosts.length ? (
                <>
                  <SectionTitle action={<Link href="/posts" className="text-[14px] font-semibold underline underline-offset-2">All posts</Link>}>
                    Neighbours are asking
                  </SectionTitle>
                  <div className="lg:grid lg:grid-cols-2 lg:gap-x-10">
                    {openPosts.slice(0, 2).map((p) => <PostCard key={p.id} p={p} onRespond={() => setReplyTo(p)} />)}
                  </div>
                </>
              ) : null}
              <SectionTitle action={<button onClick={() => setTab("rent")} className="text-[14px] font-semibold underline underline-offset-2">See all</button>}>
                Recommended near you
              </SectionTitle>
              <FeedGrid>
                {forYou.slice(0, 6).map((l) => <ListingCard key={l.id} l={l} size="lg" />)}
              </FeedGrid>
              <GroupBuys />
              <SectionTitle>More from your street</SectionTitle>
              <Grid>{forYou.slice(6).map((l) => <ListingCard key={l.id} l={l} />)}</Grid>
            </>
          ) : (
            <>
              {tab === "vendors" ? (
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <ForecastCard />
                  <GroupBuys inline />
                </div>
              ) : null}
              {tab === "gigs" ? (
                <p className="mt-4 text-[14px] text-muted">
                  Can&apos;t find it? <Link href="/posts/new" className="font-semibold text-ink underline underline-offset-2">Post what you need</Link> and helpers reply to you.
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
    <ul className={inline ? "" : "grid gap-x-10 lg:grid-cols-2"}>
      {state.groups.map((g) => {
        const l = listing(g.listingId);
        if (!l) return null;
        const joined = me ? g.joined.includes(me.id) : false;
        return (
          <li key={g.id} className="border-b border-line last:border-b-0">
            <Link href={`/item?id=${l.id}`} className="flex items-center gap-3.5 py-3 hover:bg-surface/50">
              <ArtTile art={l.art} size={48} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold">{l.title}</span>
                <span className="block text-[13px] text-muted">
                  {g.joined.length} of {g.target} homes on {g.street} · {fmtDay(g.date)}
                  {joined ? " · you're in" : ""}
                </span>
                <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-[#EDEDEA]">
                  <span className="block h-full rounded-full bg-ember" style={{ width: `${Math.min(100, (g.joined.length / g.target) * 100)}%` }} />
                </span>
              </span>
              <span className="text-right text-[14px] font-semibold whitespace-nowrap">
                {rm(l.groupPrice ?? l.price)}
                <span className="block text-[12px] font-normal text-muted line-through">{rm(l.price)}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
  if (inline) {
    return (
      <section className="rounded-[16px] border border-line px-4 py-2">
        <h2 className="pt-2 text-[13px] font-semibold">Group buys on your street</h2>
        {body}
      </section>
    );
  }
  return (
    <>
      <SectionTitle>Group buys on your street</SectionTitle>
      {body}
    </>
  );
}
