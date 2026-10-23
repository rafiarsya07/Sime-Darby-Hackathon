"use client";

import Link from "next/link";
import { ArtTile } from "@/components/Art";
import { ArrowRightIcon } from "@/components/Icons";
import { Page } from "@/components/ui";
import type { Art } from "@/lib/types";

const OPTIONS: { href: string; title: string; note: string; art: Art }[] = [
  { href: "/list/item", title: "Lend an item or space", note: "Tools, gear, clothes, your driveway. Earn rent and points.", art: "washer" },
  { href: "/list/service", title: "Offer a service", note: "Garden, cooking, pets, tuition, IT help for your street.", art: "lawn" },
  { href: "/posts/new", title: "Post a request", note: "Need something? Ask the street and pick who to chat with.", art: "other" },
];

export default function ListPage() {
  return (
    <Page>
      <h1 className="font-display text-[24px] leading-[1.15] font-semibold tracking-[-0.035em]">What would you like to do?</h1>
      <p className="mt-1 text-[14px] text-muted">Everything stays inside your verified township.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((o, i) => {
          const tone = ["bg-sun text-ink", "bg-ember text-white", "bg-night text-white"][i];
          return (
            <Link key={o.href} href={o.href} className={`press relative flex min-h-[150px] flex-col overflow-hidden rounded-[26px] p-5 ${tone}`}>
              <span className="font-display text-[17px] leading-[1.15] font-semibold tracking-[-0.03em]">{o.title}</span>
              <span className={`mt-1.5 max-w-[78%] text-[13px] leading-snug ${i === 0 ? "text-ink/70" : "text-white/70"}`}>{o.note}</span>
              <span className={`mt-auto flex size-11 items-center justify-center self-end rounded-full ${i === 0 ? "bg-night text-white" : "bg-white text-ink"}`}>
                <ArrowRightIcon size={18} />
              </span>
              <span aria-hidden="true" className={`pointer-events-none absolute -bottom-6 -left-2 font-display text-[72px] font-bold tracking-[-0.06em] ${i === 0 ? "text-ink/[0.07]" : "text-white/[0.09]"}`}>
                {["lend", "help", "ask"][i]}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-4 rounded-[26px] border-2 border-dashed border-line-strong bg-white/50 px-4 py-4">
        <ArtTile art="aircond" size={48} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 text-[15px] font-semibold">
            Join as a vendor
            <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-ink-2">Coming soon</span>
          </span>
          <span className="block text-[13px] text-muted">Businesses apply with SSM and insurance. SDP checks every vendor before they appear.</span>
        </span>
      </div>
    </Page>
  );
}
