"use client";

import Link from "next/link";
import { useState } from "react";
import { ArtTile } from "@/components/Art";
import { ChevronRightIcon } from "@/components/Icons";
import { Empty, LinkButton, Meta, Page } from "@/components/ui";
import { fmtDay, rm } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Booking } from "@/lib/types";

const TIER = { rent: "Rent", gigs: "Gig", vendors: "Vendor" } as const;

function statusLine(b: Booking, meId: string) {
  const provider = b.providerId === meId;
  switch (b.status) {
    case "requested":
      return { text: provider ? "Needs your answer" : "Waiting", you: provider };
    case "accepted":
      return { text: b.tier === "rent" ? "Ready for pick up" : "Booked", you: b.tier === "rent" };
    case "in_use":
      return { text: provider ? "Lent out" : "With you", you: provider };
    case "done":
      return { text: "Points in 24h", you: false };
    case "closed":
      return { text: "Closed", you: false };
    default:
      return { text: "Declined", you: false };
  }
}

export default function BookingsPage() {
  const { me, state, nameOf } = useStore();
  const [tab, setTab] = useState<"active" | "past">("active");
  if (!me) return null;

  const mine = state.bookings.filter((b) => b.customerId === me.id || b.providerId === me.id);
  const active = mine.filter((b) => ["requested", "accepted", "in_use", "done"].includes(b.status));
  const past = mine.filter((b) => b.status === "closed" || b.status === "declined");
  const list = tab === "active" ? active : past;

  return (
    <Page>
      <h1 className="font-display text-[24px] leading-[1.15] font-semibold tracking-[-0.035em]">Bookings</h1>

      <div role="tablist" className="mt-5 inline-flex gap-1 rounded-full bg-white p-1">
        {(["active", "past"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${tab === t ? "bg-night text-white" : "text-muted hover:text-ink"}`}
          >
            {t === "active" ? `Active (${active.length})` : "Past"}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <Empty title={tab === "active" ? "Nothing on right now" : "No past bookings yet"}>
          <LinkButton href="/home" variant="secondary" size="sm" className="mt-3">Browse your street</LinkButton>
        </Empty>
      ) : (
        <ul className="mt-4 space-y-2">
          {list.map((b) => {
            const provider = b.providerId === me.id;
            const other = nameOf(provider ? b.customerId : b.providerId);
            const s = statusLine(b, me.id);
            return (
              <li key={b.id}>
                <Link href={`/booking?id=${b.id}`} className="press flex items-center gap-3.5 rounded-[22px] bg-white p-2.5 pr-3 hover:shadow-[0_10px_24px_-16px_rgba(21,23,28,0.4)]">
                  <ArtTile art={b.art} size={60} className="rounded-[16px]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold">{b.title.split(",")[0]}</span>
                    <Meta className="mt-0.5 text-[12px]" items={[{ icon: "user", text: other }, { icon: "cal", text: fmtDay(b.from) }]} />
                    <span className={`mt-1.5 inline-block rounded-full px-2.5 py-1 text-[11px] leading-none font-semibold ${s.you ? "bg-ember text-white" : b.status === "closed" ? "bg-leaf-wash text-leaf-text" : "bg-surface text-ink-2"}`}>
                      {s.text}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-display text-[14px] font-semibold tracking-[-0.03em]">{b.total ? rm(b.total) : "Free"}</span>
                    <span className="block text-[11px] text-muted">{TIER[b.tier]}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Page>
  );
}
