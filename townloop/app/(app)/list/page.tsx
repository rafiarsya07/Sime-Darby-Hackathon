"use client";

import Link from "next/link";
import { ArtTile } from "@/components/Art";
import { ArrowRightIcon } from "@/components/Icons";
import { Page } from "@/components/ui";
import type { Art } from "@/lib/types";

const OPTIONS: { href: string; title: string; note: string; art: Art }[] = [
  { href: "/list/item", title: "Lend an item or space", note: "Tools, gear, clothes or your driveway.", art: "washer" },
  { href: "/list/service", title: "Offer a service", note: "Garden, cooking, pets, tuition, IT help.", art: "lawn" },
  { href: "/posts/new", title: "Post a request", note: "Ask the street for anything.", art: "other" },
];

export default function ListPage() {
  return (
    <Page>
      <h1 className="font-display text-[24px] leading-[1.15] font-semibold tracking-[-0.035em]">What do you want to do?</h1>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {OPTIONS.map((o, i) => {
          const tone = ["bg-sun text-ink", "bg-ember text-white", "bg-night text-white"][i];
          return (
            <Link key={o.href} href={o.href} className={`press relative flex min-h-[128px] flex-col overflow-hidden rounded-[26px] p-5 ${tone}`}>
              <span className="font-display text-[17px] leading-[1.15] font-semibold tracking-[-0.03em]">{o.title}</span>
              <span className={`mt-1.5 max-w-[78%] text-[13px] leading-snug ${i === 0 ? "text-ink/70" : "text-white/70"}`}>{o.note}</span>
              <span className={`mt-auto flex size-11 items-center justify-center self-end rounded-full ${i === 0 ? "bg-night text-white" : "bg-white text-ink"}`}>
                <ArrowRightIcon size={18} />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-4 rounded-[26px] bg-white px-4 py-4">
        <ArtTile art="aircond" size={48} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 text-[15px] font-semibold">
            Join as a vendor
            <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-ink-2">Coming soon</span>
          </span>
          <span className="block text-[13px] text-muted">Every vendor is checked by SDP first.</span>
        </span>
      </div>
    </Page>
  );
}
