import { addDays, isoDate, nextSaturday } from "./format";
import type { DemoState, Listing, Reward, Tier, User, Vendor } from "./types";

/**
 * Demo data for Elmina Valley. Siti, Tan and Pak Rahman are the three
 * personas you can sign in as; everyone else fills the street so the feeds
 * feel lived in.
 */

const PRECINCT = "Elmina Valley";

export const USERS: User[] = [
  { id: "siti", name: "Siti", street: "Jalan Elmina 3/2", precinct: PRECINCT, phase: "Phase 3", tenure: "Owner", since: "2023", bio: "Works in Shah Alam, home most evenings." },
  { id: "tan", name: "Tan", street: "Jalan Elmina 3/4", precinct: PRECINCT, phase: "Phase 3", tenure: "Owner", since: "2024", bio: "New to the street, two kids, one very muddy driveway." },
  { id: "rahman", name: "Pak Rahman", street: "Jalan Elmina 3/7", precinct: PRECINCT, phase: "Phase 3", tenure: "Owner", since: "2021", bio: "Retired. Keeps three gardens on this street looking sharp." },
  { id: "farid", name: "Farid", street: "Jalan Elmina 3/6", precinct: PRECINCT, phase: "Phase 3", tenure: "Tenant", since: "2024", bio: "Two cats, happy to look after yours." },
  { id: "hocklee", name: "Hock Lee", street: "Jalan Elmina 3/9", precinct: PRECINCT, phase: "Phase 3", tenure: "Owner", since: "2022" },
  { id: "meiling", name: "Mei Ling", street: "Jalan Elmina 3/3", precinct: PRECINCT, phase: "Phase 3", tenure: "Owner", since: "2022", bio: "Cooks too much on purpose." },
  { id: "priya", name: "Priya", street: "Jalan Elmina 3/12", precinct: PRECINCT, phase: "Phase 3", tenure: "Owner", since: "2023" },
  { id: "aiman", name: "Aiman", street: "Jalan Elmina 2/11", precinct: PRECINCT, phase: "Phase 2", tenure: "Tenant", since: "2025", bio: "Uni student. Laptops, routers and Form 5 maths." },
  { id: "sdp", name: "SDP Community", street: "Elmina Valley Park", precinct: PRECINCT, phase: "Phase 3", tenure: "Owner", since: "2020" },
];

export const VENDORS: Vendor[] = [
  { id: "coolbreeze", name: "CoolBreeze Aircond", kind: "local", area: "Elmina Business Centre", checks: ["SSM registered", "Insured", "SDP verified"], rating: 4.8, jobs: 540, since: "2019" },
  { id: "sunwash", name: "SunWash Solar Care", kind: "local", area: "Bandar Bukit Raja", checks: ["SSM registered", "Insured", "SDP verified"], rating: 4.7, jobs: 120, since: "2022" },
  { id: "gutterpro", name: "GutterPro", kind: "local", area: "Elmina Business Centre", checks: ["SSM registered", "SDP verified"], rating: 4.6, jobs: 88, since: "2023" },
  { id: "pestaway", name: "PestAway", kind: "outside", area: "Shah Alam", checks: ["SSM registered", "Pest control licence", "Insured"], rating: 4.5, jobs: 1200, since: "2015" },
  { id: "fixright", name: "FixRight Plumbing", kind: "outside", area: "Klang", checks: ["SSM registered", "Insured"], rating: 4.4, jobs: 760, since: "2017" },
];

/** People who can sign in from the demo picker. */
export const DEMO_ACCOUNTS = [
  { id: "siti", note: "Lends her jet washer, needs her aircond serviced" },
  { id: "tan", note: "Rents things and needs his lawn mowed" },
  { id: "rahman", note: "Gig worker, answers posts for garden jobs" },
] as const;

export const TIERS: { id: Tier; label: string; blurb: string }[] = [
  { id: "rent", label: "Rent", blurb: "Tools, gear and spaces from neighbours" },
  { id: "gigs", label: "Gigs", blurb: "Neighbours who can help" },
  { id: "vendors", label: "Vendors", blurb: "Local and vetted pros" },
];

export const CATEGORIES: Record<Tier, string[]> = {
  rent: ["Cleaning", "Garden", "Tools", "Party", "Kids", "Wellness", "Sports", "Clothing", "Spaces", "SDP facilities"],
  gigs: ["Garden", "Food", "Pets", "Tuition", "IT help", "Errands"],
  vendors: ["Aircond", "Solar", "Gutters", "Pest control", "Plumbing"],
};

export const REWARDS: Reward[] = [
  { id: "bbq", title: "BBQ pit slot", place: "Elmina Valley Park", cost: 500 },
  { id: "dining10", title: "RM10 dining voucher", place: "Elmina Lakeside Mall", cost: 500 },
  { id: "dining20", title: "RM20 dining voucher", place: "Elmina Lakeside Mall", cost: 1000 },
  { id: "fees", title: "RM50 off maintenance fees", place: "Next quarterly bill", cost: 2500 },
  { id: "donate", title: "Donate 100 points", place: "Community guarantee pool", cost: 100 },
];

const L = (x: Omit<Listing, "rating" | "reviews" | "done"> & Partial<Pick<Listing, "rating" | "reviews" | "done">>): Listing => ({
  rating: 0,
  reviews: 0,
  done: 0,
  ...x,
});

export const SEED_LISTINGS: Listing[] = [
  // Rent
  L({ id: "washer", tier: "rent", ownerId: "siti", title: "Jet washer, 1800W", category: "Cleaning", art: "washer", price: 30, unit: "day", deposit: 100, when: "6pm to 9pm, at her gate", description: "Comes with the patio brush and a 5 m hose. Great for porches and cars.", rating: 4.9, reviews: 8, done: 9 }),
  L({ id: "massager", tier: "rent", ownerId: "hocklee", title: "Leg and foot massager", category: "Wellness", art: "massager", price: 15, unit: "day", deposit: 80, when: "Any evening", description: "Heated, three intensity levels. Wiped down after every loan.", rating: 4.9, reviews: 30, done: 41 }),
  L({ id: "tent", tier: "rent", ownerId: "priya", title: "Party tent, 3 x 3 m", category: "Party", art: "tent", price: 40, unit: "day", deposit: 150, when: "Friday evening pick up", description: "Pop up tent with side walls. Fits two folding tables underneath.", rating: 4.9, reviews: 6, done: 7 }),
  L({ id: "ladder", tier: "rent", ownerId: "farid", title: "Extension ladder, 4 m", category: "Tools", art: "ladder", price: 8, unit: "day", deposit: 50, when: "After 7pm", description: "Aluminium, locks at three heights. Reaches most porch gutters.", rating: 4.8, reviews: 12, done: 14 }),
  L({ id: "mower", tier: "rent", ownerId: "hocklee", title: "Lawnmower, petrol", category: "Garden", art: "mower", price: 25, unit: "day", deposit: 150, when: "Weekends, 8am to 11am", description: "Self propelled. Fuel not included.", rating: 4.7, reviews: 5, done: 6 }),
  L({ id: "racket", tier: "rent", ownerId: "aiman", title: "Badminton set, 4 rackets", category: "Sports", art: "racket", price: 0, unit: "day", free: true, when: "Anytime, just ask", description: "Free to borrow. Shuttlecocks included, please return the tube.", rating: 5, reviews: 9, done: 11 }),
  L({ id: "stroller", tier: "rent", ownerId: "meiling", title: "Baby stroller, foldable", category: "Kids", art: "stroller", price: 5, unit: "day", deposit: 50, when: "Mornings", description: "Folds with one hand, fits a Myvi boot.", rating: 4.8, reviews: 4, done: 5 }),
  L({ id: "drill", tier: "rent", ownerId: "aiman", title: "Cordless drill and bits", category: "Tools", art: "drill", price: 6, unit: "day", deposit: 40, when: "Evenings", description: "Two batteries, masonry and wood bits.", rating: 5, reviews: 3, done: 3 }),
  L({ id: "driveway", tier: "rent", ownerId: "meiling", title: "Driveway, overnight", category: "Spaces", art: "driveway", price: 5, unit: "night", when: "From 7pm", description: "Fits one car. Gate code shared after booking.", rating: 4.9, reviews: 18, done: 22 }),
  L({ id: "ev", tier: "rent", ownerId: "meiling", title: "EV charger, 7 kW", category: "Spaces", art: "ev", price: 15, unit: "night", when: "From 10pm", description: "Type 2 plug. Park on the driveway, charge overnight.", rating: 4.8, reviews: 3, done: 4 }),
  L({ id: "bbq", tier: "rent", ownerId: "sdp", title: "BBQ pit, Elmina Valley Park", category: "SDP facilities", art: "bbq", price: 20, unit: "slot", facility: true, when: "Saturday, 6pm to 10pm", description: "Run by SDP. Includes the covered table and the tap next to it.", rating: 4.7, reviews: 40, done: 48 }),

  // Gigs
  L({ id: "lawn", tier: "gigs", ownerId: "rahman", title: "Lawn mowing and edge trimming", category: "Garden", art: "lawn", price: 45, unit: "job", when: "Weekdays from 3pm, weekends all day", description: "Brings his own mower and trimmer. Clippings bagged and taken away.", rating: 4.9, reviews: 31, done: 31 }),
  L({ id: "lunch", tier: "gigs", ownerId: "meiling", title: "Home cooked lunch sets", category: "Food", art: "cook", price: 12, unit: "set", when: "Order by 9pm the day before", description: "Rice, two dishes and soup. Menu changes daily, no MSG.", rating: 5, reviews: 52, done: 64 }),
  L({ id: "petsit", tier: "gigs", ownerId: "farid", title: "Pet sitting, cats and dogs", category: "Pets", art: "pet", price: 30, unit: "visit", when: "Daily visits or overnight", description: "Feeding, litter, a short walk and photos for you.", rating: 4.7, reviews: 9, done: 9 }),
  L({ id: "tuition", tier: "gigs", ownerId: "aiman", title: "Maths tuition, Form 1 to 5", category: "Tuition", art: "tutor", price: 40, unit: "hour", when: "Weekday evenings", description: "SPM maths and add maths. At your dining table or the clubhouse.", rating: 4.8, reviews: 7, done: 12 }),
  L({ id: "ithelp", tier: "gigs", ownerId: "aiman", title: "Laptop and wifi help", category: "IT help", art: "it", price: 30, unit: "visit", when: "After 5pm", description: "Slow laptops, dead spots, printers that won't print.", rating: 4.9, reviews: 6, done: 8 }),
  L({ id: "carwash", tier: "gigs", ownerId: "priya", title: "Car wash at your porch", category: "Errands", art: "carwash", price: 20, unit: "job", when: "Weekend mornings", description: "Waterless wash, inside vacuum included.", rating: 4.6, reviews: 5, done: 6 }),

  // Vendors
  L({ id: "aircond", tier: "vendors", ownerId: "coolbreeze", title: "Aircond chemical wash", category: "Aircond", art: "aircond", price: 120, unit: "unit", groupPrice: 90, groupTarget: 6, recurring: "Every 3 months", when: "Next free slot Tuesday", description: "Coil and blower chemical wash, gas pressure check, 30 day service warranty.", rating: 4.8, reviews: 210, done: 540 }),
  L({ id: "solar", tier: "vendors", ownerId: "sunwash", title: "Solar panel cleaning, up to 12 panels", category: "Solar", art: "solar", price: 180, unit: "job", groupPrice: 140, groupTarget: 5, recurring: "Every 6 months", when: "Weekdays", description: "Soft brush and deionised water. Before and after output reading.", rating: 4.7, reviews: 64, done: 120 }),
  L({ id: "gutter", tier: "vendors", ownerId: "gutterpro", title: "Roof gutter cleaning", category: "Gutters", art: "gutter", price: 200, unit: "job", when: "Within 5 days", description: "Gutters and downpipes cleared, photos of every section.", rating: 4.6, reviews: 41, done: 88 }),
  L({ id: "pest", tier: "vendors", ownerId: "pestaway", title: "Termite and pest control", category: "Pest control", art: "pest", price: 150, unit: "visit", recurring: "Every 6 months", when: "Within 3 days", description: "Inspection, baiting and a written report. Licensed technicians.", rating: 4.5, reviews: 380, done: 1200 }),
  L({ id: "plumbing", tier: "vendors", ownerId: "fixright", title: "Plumbing check and minor repairs", category: "Plumbing", art: "plumbing", price: 80, unit: "visit", when: "Same or next day", description: "Leaks, clogged sinks, water heater checks. Parts quoted before work.", rating: 4.4, reviews: 290, done: 760 }),
];

export function vendorKindOf(listing: Listing) {
  return VENDORS.find((v) => v.id === listing.ownerId)?.kind;
}

/** Fresh demo state, dated around the coming weekend so it never looks stale. */
export function seedState(): DemoState {
  const now = new Date();
  const sat = nextSaturday(now);
  const sun = addDays(sat, 1);
  const nextSat = addDays(sat, 7);
  const tue = addDays(sat, 3);
  const ago = (days: number, h = 19, m = 0) => {
    const x = addDays(now, -days);
    x.setHours(h, m, 0, 0);
    return x.toISOString();
  };
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString();

  return {
    userId: null,
    listings: SEED_LISTINGS,
    posts: [
      { id: "lawnpost", authorId: "tan", tier: "gigs", title: "Mow my lawn and trim the edges", details: "Front and back, about 60 square metres. Mower here if you need it.", budget: 40, when: "Saturday afternoon", from: isoDate(sat), to: isoDate(sat), art: "lawn", status: "open", createdAt: hoursAgo(5) },
      { id: "blazer", authorId: "priya", tier: "rent", title: "Party blazer, size M", details: "Office dinner on Saturday night. Navy or black. Happy to dry clean after.", budget: 20, when: "This Saturday", from: isoDate(sat), to: isoDate(sun), art: "blazer", status: "open", createdAt: hoursAgo(3) },
      { id: "aircondpost", authorId: "siti", tier: "vendors", title: "Aircond servicing for 3 units", details: "Two bedrooms and the living room. Last serviced a year ago.", budget: 300, when: "Next two weeks", from: isoDate(tue), to: isoDate(addDays(tue, 10)), art: "aircond", status: "open", createdAt: hoursAgo(20) },
      { id: "highchair", authorId: "hocklee", tier: "rent", title: "Baby high chair for 2 weeks", details: "Grandkids visiting. Any clean high chair is fine, can collect.", budget: 0, when: "From next Saturday", from: isoDate(nextSat), to: isoDate(addDays(nextSat, 14)), art: "stroller", status: "open", createdAt: hoursAgo(28) },
    ],
    requests: [
      { id: "rq1", kind: "post", postId: "lawnpost", fromId: "rahman", toId: "tan", message: "I can do Saturday 3pm, front and back. I bring my own mower.", offer: 40, status: "pending", createdAt: hoursAgo(4) },
      { id: "rq2", kind: "post", postId: "lawnpost", fromId: "aiman", toId: "tan", message: "Free after 5pm Saturday. I'd borrow your mower.", offer: 35, status: "pending", createdAt: hoursAgo(2) },
      { id: "rq3", kind: "booking", bookingId: "b0466", fromId: "farid", toId: "siti", message: "Washing the porch before my parents visit.", status: "pending", createdAt: hoursAgo(1) },
    ],
    bookings: [
      {
        id: "b0428", tier: "rent", listingId: "washer", title: "Jet washer, 1800W", art: "washer", providerId: "siti", providerKind: "resident", customerId: "tan",
        from: isoDate(sat), to: isoDate(sun), total: 60, deposit: 100, code: "4821", status: "accepted",
        events: [{ status: "requested", at: ago(1, 21, 12) }, { status: "accepted", at: ago(1, 21, 20) }],
      },
      {
        id: "b0466", tier: "rent", listingId: "washer", title: "Jet washer, 1800W", art: "washer", providerId: "siti", providerKind: "resident", customerId: "farid",
        from: isoDate(nextSat), to: isoDate(nextSat), total: 30, deposit: 100, code: "3307", status: "requested",
        events: [{ status: "requested", at: hoursAgo(1) }],
      },
      {
        id: "b0391", tier: "rent", listingId: "washer", title: "Jet washer, 1800W", art: "washer", providerId: "siti", providerKind: "resident", customerId: "farid",
        from: isoDate(addDays(now, -14)), to: isoDate(addDays(now, -13)), total: 60, deposit: 100, code: "1975", onTime: true, status: "closed",
        events: [{ status: "requested", at: ago(16) }, { status: "accepted", at: ago(16, 20) }, { status: "in_use", at: ago(14, 18) }, { status: "done", at: ago(13, 19) }, { status: "closed", at: ago(12, 19) }],
      },
      {
        id: "b0402", tier: "gigs", listingId: "lawn", title: "Lawn mowing and edge trimming", art: "lawn", providerId: "rahman", providerKind: "resident", customerId: "meiling",
        from: isoDate(addDays(now, -10)), to: isoDate(addDays(now, -10)), time: "3pm", total: 45, code: "6120", status: "closed",
        events: [{ status: "requested", at: ago(12) }, { status: "accepted", at: ago(12, 20) }, { status: "done", at: ago(10, 17) }, { status: "closed", at: ago(9, 17) }],
      },
    ],
    groups: [
      { id: "g-aircond", listingId: "aircond", street: "Jalan Elmina 3", joined: ["meiling", "hocklee", "farid", "priya"], target: 6, date: isoDate(tue) },
      { id: "g-solar", listingId: "solar", street: "Jalan Elmina 3", joined: ["hocklee", "priya"], target: 5, date: isoDate(addDays(tue, 2)) },
    ],
    reviews: [
      { id: "rv1", aboutId: "siti", byId: "farid", stars: 5, title: "Jet washer", text: "Spotless and ready at 6 on the dot.", at: ago(12) },
      { id: "rv2", aboutId: "siti", byId: "hocklee", stars: 5, title: "Jet washer", text: "Showed me how to switch the nozzles. Porch looks new.", at: ago(30) },
      { id: "rv3", aboutId: "rahman", byId: "meiling", stars: 5, title: "Lawn mowing", text: "Neat edges and he bagged every clipping.", at: ago(9) },
      { id: "rv4", aboutId: "rahman", byId: "hocklee", stars: 5, title: "Lawn mowing", text: "Came back the next week without me asking. Reliable.", at: ago(40) },
      { id: "rv5", aboutId: "aiman", byId: "siti", stars: 5, title: "Laptop and wifi help", text: "Fixed our router in ten minutes and explained why.", at: ago(20) },
      { id: "rv6", aboutId: "aiman", byId: "priya", stars: 4, title: "Maths tuition", text: "Patient with my son. Sometimes 10 minutes late.", at: ago(45) },
      { id: "rv7", aboutId: "coolbreeze", byId: "meiling", stars: 5, title: "Aircond chemical wash", text: "On time, laid sheets down, explained the gas reading.", at: ago(60) },
      { id: "rv8", aboutId: "pestaway", byId: "hocklee", stars: 4, title: "Termite and pest control", text: "Thorough, report came the same day.", at: ago(90) },
    ],
    points: [
      { id: "s1", userId: "siti", amount: 200, label: "Verified with SDP PRIME", at: ago(60, 9) },
      { id: "s2", userId: "siti", amount: 100, label: "First listing", at: ago(58, 10) },
      { id: "s3", userId: "siti", amount: 760, label: "Carried over from SDP PRIME", at: ago(60, 9) },
      { id: "s4", userId: "siti", amount: 140, label: "Hired help: IT help", at: ago(19) },
      { id: "s5", userId: "siti", amount: 35, label: "Lent Jet washer", at: ago(12, 19) },
      { id: "t1", userId: "tan", amount: 200, label: "Verified with SDP PRIME", at: ago(30, 9) },
      { id: "t2", userId: "tan", amount: 46, label: "Rented Extension ladder", at: ago(8) },
      { id: "t3", userId: "tan", amount: 10, label: "Returned on time", at: ago(8) },
      { id: "r1", userId: "rahman", amount: 200, label: "Verified with SDP PRIME", at: ago(80, 9) },
      { id: "r2", userId: "rahman", amount: 100, label: "First listing", at: ago(79, 9) },
      { id: "r3", userId: "rahman", amount: 27, label: "Helped out: Lawn mowing", at: ago(9, 17) },
    ],
    redemptions: [],
    saved: [],
  };
}
