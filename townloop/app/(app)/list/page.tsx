"use client";

import Link from "next/link";
import { ArtTile } from "@/components/Art";
import { ChevronRightIcon } from "@/components/Icons";
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
      <h1 className="text-[24px] font-semibold tracking-[-0.02em]">What would you like to do?</h1>
      <p className="mt-1 text-[14px] text-muted">Everything stays inside your verified township.</p>

      <ul className="mt-6">
        {OPTIONS.map((o) => (
          <li key={o.href} className="border-b border-line">
            <Link href={o.href} className="flex items-center gap-4 py-4 hover:bg-surface/50">
              <ArtTile art={o.art} size={56} />
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-semibold">{o.title}</span>
                <span className="block text-[13px] text-muted">{o.note}</span>
              </span>
              <ChevronRightIcon size={18} className="text-muted" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-4 rounded-[12px] border border-dashed border-line-strong px-4 py-4">
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
