import type { Booking, User } from "./types";

/**
 * Eco-Points rules, final for the hackathon.
 *
 * 50 points = RM1. Points land when a booking closes, 24 hours after the
 * return or the finished job, so disputes can still cancel them.
 *
 * Customers earn more than providers: providers already earn money and
 * get a ranking boost. Vendors earn nothing; they get boosted on For you.
 */

export const POINTS_PER_RINGGIT = 50;
export const DISPUTE_HOURS = 24;

export const RULES = {
  rent: {
    renter: { base: 20, perRm: 2, onTime: 10 },
    owner: { base: 5, perRm: 0.5 },
    free: { renter: 20, owner: 40 },
    facility: { renter: 10 },
  },
  gigs: {
    customer: { base: 15, perRm: 2, samePhase: 10 },
    provider: { base: 5, perRm: 0.5 },
  },
  vendors: {
    local: { base: 20, perRm: 1 },
    outside: { perRm: 0.5, min: 10 },
    groupFilled: 50,
    recurringVisit: 30,
  },
  posts: { fulfilled: 10 },
  bonus: {
    verify: 200,
    firstListing: 100,
    review: 5,
    reviewMonthlyCap: 10,
    referral: 100,
    referralYearlyCap: 10,
    monthlyStreak: { loops: 3, points: 50 },
  },
} as const;

export type Award = { userId: string; amount: number; label: string };

/** What a closed booking pays out, line by line, so the UI can show the maths. */
export function awardsFor(b: Booking, opts: { vendorKind?: "local" | "outside"; customer?: User; provider?: User }): Award[] {
  const out: Award[] = [];
  const short = b.title.split(",")[0];
  const rm = b.total;
  const add = (userId: string, amount: number, label: string) => {
    const n = Math.floor(amount);
    if (n > 0) out.push({ userId, amount: n, label });
  };

  if (b.tier === "rent") {
    if (b.facility) {
      add(b.customerId, RULES.rent.facility.renter, `Booked ${short}`);
    } else if (b.free || rm === 0) {
      add(b.customerId, RULES.rent.free.renter, `Borrowed ${short} for free`);
      if (b.providerKind === "resident") add(b.providerId, RULES.rent.free.owner, `Lent ${short} for free`);
    } else {
      add(b.customerId, RULES.rent.renter.base + rm * RULES.rent.renter.perRm, `Rented ${short}`);
      if (b.onTime) add(b.customerId, RULES.rent.renter.onTime, "Returned on time");
      if (b.providerKind === "resident") add(b.providerId, RULES.rent.owner.base + rm * RULES.rent.owner.perRm, `Lent ${short}`);
    }
  }

  if (b.tier === "gigs") {
    add(b.customerId, RULES.gigs.customer.base + rm * RULES.gigs.customer.perRm, `Hired help: ${short}`);
    if (opts.customer && opts.provider && opts.customer.phase === opts.provider.phase) {
      add(b.customerId, RULES.gigs.customer.samePhase, "Helper from your phase");
    }
    add(b.providerId, RULES.gigs.provider.base + rm * RULES.gigs.provider.perRm, `Helped out: ${short}`);
  }

  if (b.tier === "vendors") {
    if (opts.vendorKind === "local") {
      add(b.customerId, RULES.vendors.local.base + rm * RULES.vendors.local.perRm, `Local vendor: ${short}`);
    } else {
      add(b.customerId, Math.max(RULES.vendors.outside.min, rm * RULES.vendors.outside.perRm), `Vendor: ${short}`);
    }
    if (b.group) add(b.customerId, RULES.vendors.groupFilled, "Street group buy filled");
    if (b.recurring) add(b.customerId, RULES.vendors.recurringVisit, "Recurring plan visit");
  }

  if (b.postId && b.providerKind === "resident") add(b.providerId, RULES.posts.fulfilled, "Answered a wanted post");

  return out;
}

/** Plain language rows for the "How to earn" table. */
export const EARN_TABLE: { tier: string; who: string; how: string }[] = [
  { tier: "Rent", who: "Renter", how: "20 per loop, 2 per RM, 10 for returning on time" },
  { tier: "Rent", who: "Owner", how: "5 per loop, 0.5 per RM" },
  { tier: "Rent", who: "Free lending", how: "Renter 20, owner 40" },
  { tier: "Rent", who: "SDP facility", how: "10 per booking" },
  { tier: "Gigs", who: "Customer", how: "15 per job, 2 per RM, 10 if your helper is in your phase" },
  { tier: "Gigs", who: "Provider", how: "5 per job, 0.5 per RM" },
  { tier: "Vendors", who: "Local vendor", how: "20 per job, 1 per RM" },
  { tier: "Vendors", who: "Outside vendor", how: "0.5 per RM, at least 10" },
  { tier: "Vendors", who: "Group buy fills", how: "50 per household" },
  { tier: "Vendors", who: "Recurring plan", how: "30 per visit" },
  { tier: "Posts", who: "Answering a post", how: "10 on top of the job" },
  { tier: "Bonus", who: "Verify with SDP PRIME", how: "200, once" },
  { tier: "Bonus", who: "First listing", how: "100, once" },
  { tier: "Bonus", who: "Leave a review", how: "5, up to 10 a month" },
  { tier: "Bonus", who: "Refer a neighbour", how: "100, up to 10 a year" },
  { tier: "Bonus", who: "3 loops in a month", how: "50" },
];
