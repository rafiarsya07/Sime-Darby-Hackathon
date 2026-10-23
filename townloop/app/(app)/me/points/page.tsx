"use client";

import { useState } from "react";
import { EcoPointsIcon, VoucherIcon } from "@/components/Icons";
import { Sheet } from "@/components/Sheet";
import { Button, Page, PageTitle, SectionTitle } from "@/components/ui";
import { EcoCard } from "@/components/EcoCard";
import { REWARDS } from "@/lib/data";
import { fmtPoints, rm, timeAgo } from "@/lib/format";
import { DISPUTE_HOURS, EARN_TABLE, POINTS_PER_RINGGIT } from "@/lib/points";
import { useStore } from "@/lib/store";
import type { Redemption, Reward } from "@/lib/types";

export default function PointsPage() {
  const { me, state, balance, redeem } = useStore();
  const [pick, setPick] = useState<Reward | null>(null);
  const [done, setDone] = useState<Redemption | null>(null);
  if (!me) return null;

  const pts = balance(me.id);
  const history = state.points.filter((p) => p.userId === me.id);
  const earned = history.filter((p) => p.amount > 0).reduce((s, p) => s + p.amount, 0);
  const myCodes = state.redemptions.filter((r) => r.userId === me.id);

  function close() {
    setPick(null);
    setDone(null);
  }

  return (
    <Page>
      <PageTitle>Eco points</PageTitle>
      <div className="mt-4">
        <EcoCard name={me.name} points={pts} since={me.since} next={REWARDS.filter((r) => r.id !== "donate").sort((a, b) => a.cost - b.cost).find((r) => r.cost > pts)} />
      </div>
      <p className="mt-3 text-[13px] text-muted">{fmtPoints(earned)} earned so far. Points land {DISPUTE_HOURS} hours after a booking closes.</p>

      <SectionTitle>Spend them</SectionTitle>
      <ul>
        {REWARDS.map((r) => {
          const short = r.cost - pts;
          return (
            <li key={r.id} className="mb-2 flex items-center gap-3 rounded-[22px] bg-white p-3">
              <span className={`flex size-12 shrink-0 items-center justify-center rounded-[16px] ${r.id === "fees" ? "bg-sun" : r.id === "donate" ? "bg-leaf-wash" : r.id === "bbq" ? "bg-ember-wash" : "bg-surface"}`}><VoucherIcon size={24} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold">{r.title}</span>
                <span className="block text-[13px] text-muted">{r.place}</span>
                <span className="mt-1 inline-block rounded-full bg-surface px-2 py-0.5 font-display text-[11px] font-semibold">{fmtPoints(r.cost)} pts</span>
              </span>
              <Button size="sm" variant={short > 0 ? "secondary" : "primary"} disabled={short > 0} onClick={() => setPick(r)}>
                {short > 0 ? `${fmtPoints(short)} to go` : "Redeem"}
              </Button>
            </li>
          );
        })}
      </ul>

      {myCodes.length ? (
        <>
          <SectionTitle>Your codes</SectionTitle>
          <ul className="rounded-[24px] bg-white px-4">
            {myCodes.map((c) => (
              <li key={c.id} className="flex justify-between border-b border-line py-3 text-[14px] last:border-b-0">
                <span>{REWARDS.find((r) => r.id === c.rewardId)?.title}</span>
                <span className="font-mono font-semibold">{c.code}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <SectionTitle>How to earn</SectionTitle>
      <p className="mb-3 text-[13px] text-muted">Residents earn the most. Vendors are ranked higher instead.</p>
      <div className="overflow-hidden rounded-[24px] bg-white">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-surface text-[12px] text-muted">
            <tr><th className="px-3 py-2 font-medium">Tier</th><th className="px-3 py-2 font-medium">Who</th><th className="px-3 py-2 font-medium">Points</th></tr>
          </thead>
          <tbody>
            {EARN_TABLE.map((row, i) => (
              <tr key={i} className="border-t border-line align-top">
                <td className="px-3 py-2.5 text-muted">{row.tier}</td>
                <td className="px-3 py-2.5 font-medium">{row.who}</td>
                <td className="px-3 py-2.5 text-ink-2">{row.how}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionTitle>History</SectionTitle>
      <ul className="rounded-[24px] bg-white px-4">
        {history.map((p) => (
          <li key={p.id} className="flex items-baseline justify-between gap-4 border-b border-line py-3 text-[14px] last:border-b-0">
            <span className="min-w-0">
              <span className="block">{p.label}</span>
              <span className="block text-[12px] text-muted">{timeAgo(p.at)}</span>
            </span>
            <span className={`shrink-0 font-semibold tabular-nums ${p.amount > 0 ? "text-ember-text" : "text-ink-2"}`}>
              {p.amount > 0 ? "+" : ""}{fmtPoints(p.amount)}
            </span>
          </li>
        ))}
      </ul>

      <Sheet open={!!pick} onClose={close} title={done ? "Redeemed" : "Redeem this?"}>
        {pick && !done ? (
          <>
            <p className="text-[15px]"><span className="font-semibold">{pick.title}</span> for {fmtPoints(pick.cost)} points.</p>
            <p className="mt-1 text-[13px] text-muted">You&apos;ll have {fmtPoints(pts - pick.cost)} left.</p>
            <div className="mt-5 flex gap-2">
              <Button className="flex-1" onClick={() => setDone(redeem(pick.id))}>Redeem</Button>
              <Button variant="secondary" onClick={close}>Cancel</Button>
            </div>
          </>
        ) : done ? (
          <>
            <p className="text-[15px]">{pick?.id === "donate" ? "Thank you. 100 points went to the guarantee pool." : "Show this code at the counter."}</p>
            <p className="mt-4 rounded-[10px] bg-surface py-4 text-center font-mono text-[28px] font-semibold tracking-[0.15em]">{done.code}</p>
            <Button className="mt-5 w-full" onClick={close}>Done</Button>
          </>
        ) : null}
      </Sheet>
    </Page>
  );
}
