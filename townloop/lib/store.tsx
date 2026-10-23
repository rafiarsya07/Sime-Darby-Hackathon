"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { REWARDS, seedState, USERS, VENDORS } from "./data";
import { isoDate } from "./format";
import { awardsFor, RULES } from "./points";
import type {
  Booking,
  BookingStatus,
  ChatRequest,
  DemoState,
  Listing,
  Post,
  Redemption,
  User,
  Vendor,
} from "./types";

/**
 * Demo store. Everything lives in the browser so the hackathon demo runs
 * without a server. Each action mirrors an endpoint the real backend
 * (Supabase plus n8n, per the spec) would expose.
 */

const KEY = "townloop-demo-v2";

type BookingInput = { from: string; to: string; time?: string; group?: boolean; recurring?: boolean; message: string };

type Ctx = {
  ready: boolean;
  state: DemoState;
  me: User | null;
  user: (id: string) => User | undefined;
  vendor: (id: string) => Vendor | undefined;
  listing: (id: string) => Listing | undefined;
  /** Display name for a resident or a vendor. */
  nameOf: (id: string) => string;
  balance: (userId: string) => number;
  signIn: (id: string) => void;
  signOut: () => void;
  toggleSave: (listingId: string) => void;
  requestBooking: (listingId: string, input: BookingInput) => string | null;
  respondToPost: (postId: string, message: string, offer?: number) => void;
  answerRequest: (requestId: string, accept: boolean) => string | null;
  createPost: (input: Omit<Post, "id" | "authorId" | "status" | "createdAt">) => string | null;
  addListing: (input: Omit<Listing, "id" | "ownerId" | "rating" | "reviews" | "done">) => string | null;
  setStatus: (bookingId: string, status: BookingStatus) => void;
  closeBooking: (bookingId: string) => void;
  fillGroup: (groupId: string) => void;
  review: (bookingId: string, stars: number, text: string) => void;
  redeem: (rewardId: string) => Redemption | null;
  resetDemo: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);
const code4 = () => String(Math.floor(1000 + Math.random() * 9000));
const bookingId = () => `b${String(Math.floor(500 + Math.random() * 9000)).padStart(4, "0")}`;
const now = () => new Date().toISOString();

function load(): DemoState | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DemoState) : null;
  } catch {
    return null;
  }
}

function save(state: DemoState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* Private mode or storage full: the demo still works for this tab. */
  }
}

const withEvent = (b: Booking, status: BookingStatus): Booking => ({ ...b, status, events: [...b.events, { status, at: now() }] });

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(seedState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = load();
    if (saved) setState(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) save(state);
  }, [state, ready]);

  const user = useCallback((id: string) => USERS.find((u) => u.id === id), []);
  const vendor = useCallback((id: string) => VENDORS.find((v) => v.id === id), []);
  const listing = useCallback((id: string) => state.listings.find((l) => l.id === id), [state.listings]);
  const nameOf = useCallback((id: string) => USERS.find((u) => u.id === id)?.name ?? VENDORS.find((v) => v.id === id)?.name ?? "Someone", []);
  const me = state.userId ? (user(state.userId) ?? null) : null;

  const balance = useCallback(
    (userId: string) => state.points.filter((p) => p.userId === userId).reduce((sum, p) => sum + p.amount, 0),
    [state.points],
  );

  const signIn = useCallback((id: string) => setState((s) => ({ ...s, userId: id })), []);
  const signOut = useCallback(() => setState((s) => ({ ...s, userId: null })), []);

  const toggleSave = useCallback(
    (id: string) => setState((s) => ({ ...s, saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id] })),
    [],
  );

  const requestBooking = useCallback(
    (listingId: string, input: BookingInput) => {
      const l = state.listings.find((x) => x.id === listingId);
      const me = state.userId;
      if (!me || !l || l.ownerId === me) return null;
      const id = bookingId();
      const n = l.unit === "day" || l.unit === "night"
        ? Math.max(1, Math.round((new Date(input.to).getTime() - new Date(input.from).getTime()) / 86_400_000) + (l.unit === "day" ? 1 : 0))
        : 1;
      const unitPrice = input.group && l.groupPrice ? l.groupPrice : l.price;
      const booking: Booking = {
        id,
        tier: l.tier,
        listingId: l.id,
        title: l.title,
        art: l.art,
        providerId: l.ownerId,
        providerKind: l.tier === "vendors" ? "vendor" : "resident",
        customerId: me,
        from: input.from,
        to: input.to,
        time: input.time,
        total: unitPrice * n,
        deposit: l.deposit,
        code: code4(),
        group: input.group,
        recurring: input.recurring,
        free: l.free,
        facility: l.facility,
        // SDP facilities confirm instantly; everyone else accepts by hand.
        status: l.facility ? "accepted" : "requested",
        events: l.facility ? [{ status: "requested", at: now() }, { status: "accepted", at: now() }] : [{ status: "requested", at: now() }],
      };
      const request: ChatRequest | null = l.facility
        ? null
        : { id: uid(), kind: "booking", bookingId: id, fromId: me, toId: l.ownerId, message: input.message, status: "pending", createdAt: now() };
      setState((s) => ({
        ...s,
        bookings: [booking, ...s.bookings],
        requests: request ? [request, ...s.requests] : s.requests,
        groups: input.group
          ? s.groups.map((g) => (g.listingId === l.id && !g.joined.includes(me) ? { ...g, joined: [...g.joined, me] } : g))
          : s.groups,
      }));
      return id;
    },
    [state.listings, state.userId],
  );

  const respondToPost = useCallback(
    (postId: string, message: string, offer?: number) => {
      const p = state.posts.find((x) => x.id === postId);
      const me = state.userId;
      if (!me || !p || p.authorId === me) return;
      setState((s) => ({
        ...s,
        requests: [{ id: uid(), kind: "post", postId, fromId: me, toId: p.authorId, message, offer, status: "pending", createdAt: now() }, ...s.requests],
      }));
    },
    [state.posts, state.userId],
  );

  const answerRequest = useCallback(
    (requestId: string, accept: boolean) => {
      const r = state.requests.find((x) => x.id === requestId);
      if (!r || r.status !== "pending") return null;
      const status = accept ? "accepted" : "declined";

      if (r.kind === "booking" && r.bookingId) {
        const bid = r.bookingId;
        setState((s) => ({
          ...s,
          requests: s.requests.map((x) => (x.id === requestId ? { ...x, status } : x)),
          bookings: s.bookings.map((b) => (b.id === bid ? withEvent(b, accept ? "accepted" : "declined") : b)),
        }));
        return bid;
      }

      const p = state.posts.find((x) => x.id === r.postId);
      if (!p) return null;
      if (!accept) {
        setState((s) => ({ ...s, requests: s.requests.map((x) => (x.id === requestId ? { ...x, status } : x)) }));
        return null;
      }
      // Accepting a reply to a wanted post opens a booking with the agreed price.
      const id = bookingId();
      const booking: Booking = {
        id,
        tier: p.tier,
        postId: p.id,
        title: p.title,
        art: p.art,
        providerId: r.fromId,
        providerKind: "resident",
        customerId: p.authorId,
        from: p.from,
        to: p.to,
        total: r.offer ?? p.budget ?? 0,
        free: (r.offer ?? p.budget ?? 0) === 0,
        code: code4(),
        status: "accepted",
        events: [{ status: "requested", at: r.createdAt }, { status: "accepted", at: now() }],
      };
      setState((s) => ({
        ...s,
        bookings: [booking, ...s.bookings],
        posts: s.posts.map((x) => (x.id === p.id ? { ...x, status: "matched" } : x)),
        // Everyone else who answered the same post is told no, without ever getting a chat.
        requests: s.requests.map((x) =>
          x.id === requestId ? { ...x, status, bookingId: id } : x.postId === p.id && x.status === "pending" ? { ...x, status: "declined" } : x,
        ),
      }));
      return id;
    },
    [state.requests, state.posts],
  );

  const createPost = useCallback(
    (input: Omit<Post, "id" | "authorId" | "status" | "createdAt">) => {
      const me = state.userId;
      if (!me) return null;
      const id = uid();
      setState((s) => ({ ...s, posts: [{ ...input, id, authorId: me, status: "open", createdAt: now() }, ...s.posts] }));
      return id;
    },
    [state.userId],
  );

  const addListing = useCallback(
    (input: Omit<Listing, "id" | "ownerId" | "rating" | "reviews" | "done">) => {
      const me = state.userId;
      if (!me) return null;
      const id = uid();
      setState((s) => {
        const first = !s.listings.some((l) => l.ownerId === me) && !s.points.some((p) => p.userId === me && p.label === "First listing");
        return {
          ...s,
          listings: [{ ...input, id, ownerId: me, rating: 0, reviews: 0, done: 0 }, ...s.listings],
          points: first ? [{ id: uid(), userId: me, amount: RULES.bonus.firstListing, label: "First listing", at: now() }, ...s.points] : s.points,
        };
      });
      return id;
    },
    [state.userId],
  );

  const setStatus = useCallback((id: string, status: BookingStatus) => {
    setState((s) => ({
      ...s,
      bookings: s.bookings.map((b) => {
        if (b.id !== id || b.status === status) return b;
        const next = withEvent(b, status);
        if (status === "done" && b.tier === "rent") next.onTime = isoDate(new Date()) <= b.to;
        return next;
      }),
    }));
  }, []);

  const closeBooking = useCallback((id: string) => {
    setState((s) => {
      const b = s.bookings.find((x) => x.id === id);
      if (!b || b.status === "closed") return s;
      const closed = withEvent(b, "closed");
      const group = s.groups.find((g) => g.listingId === b.listingId);
      const groupFilled = !!(b.group && group && group.joined.length >= group.target);
      const vendorKind = b.providerKind === "vendor" ? VENDORS.find((v) => v.id === b.providerId)?.kind : undefined;
      const awards = awardsFor(
        { ...closed, group: groupFilled },
        { vendorKind, customer: USERS.find((u) => u.id === b.customerId), provider: USERS.find((u) => u.id === b.providerId) },
      );
      const at = now();
      let points = [...awards.map((a) => ({ id: uid(), userId: a.userId, amount: a.amount, label: a.label, at, bookingId: id })), ...s.points];

      // 3 closed loops in a calendar month earns a streak bonus, once.
      const month = at.slice(0, 7);
      const bookings = s.bookings.map((x) => (x.id === id ? closed : x));
      for (const uidKey of [b.customerId, b.providerKind === "resident" ? b.providerId : null]) {
        if (!uidKey) continue;
        const count = bookings.filter(
          (x) => x.status === "closed" && (x.customerId === uidKey || x.providerId === uidKey) && x.events.at(-1)?.at.slice(0, 7) === month,
        ).length;
        const already = points.some((p) => p.userId === uidKey && p.label === "3 loops this month" && p.at.slice(0, 7) === month);
        if (count >= RULES.bonus.monthlyStreak.loops && !already) {
          points = [{ id: uid(), userId: uidKey, amount: RULES.bonus.monthlyStreak.points, label: "3 loops this month", at }, ...points];
        }
      }

      return {
        ...s,
        bookings,
        points,
        listings: s.listings.map((l) => (l.id === b.listingId ? { ...l, done: l.done + 1 } : l)),
        posts: s.posts.map((p) => (p.id === b.postId ? { ...p, status: "closed" } : p)),
      };
    });
  }, []);

  const fillGroup = useCallback((groupId: string) => {
    const fillers = ["siti", "tan", "rahman", "aiman", "meiling", "hocklee", "farid", "priya"];
    setState((s) => ({
      ...s,
      groups: s.groups.map((g) => {
        if (g.id !== groupId) return g;
        const joined = [...g.joined];
        for (const f of fillers) if (joined.length < g.target && !joined.includes(f)) joined.push(f);
        return { ...g, joined };
      }),
    }));
  }, []);

  const review = useCallback((id: string, stars: number, text: string) => {
    setState((s) => {
      const b = s.bookings.find((x) => x.id === id);
      const me = s.userId;
      if (!b || !me) return s;
      const aboutId = b.customerId === me ? b.providerId : b.customerId;
      const month = now().slice(0, 7);
      const thisMonth = s.points.filter((p) => p.userId === me && p.label === "Left a review" && p.at.slice(0, 7) === month).length;
      return {
        ...s,
        reviews: [{ id: uid(), aboutId, byId: me, stars, text, title: b.title.split(",")[0], at: now() }, ...s.reviews],
        points:
          thisMonth < RULES.bonus.reviewMonthlyCap
            ? [{ id: uid(), userId: me, amount: RULES.bonus.review, label: "Left a review", at: now(), bookingId: id }, ...s.points]
            : s.points,
      };
    });
  }, []);

  const redeem = useCallback(
    (rewardId: string) => {
      const reward = REWARDS.find((r) => r.id === rewardId);
      const me = state.userId;
      if (!me || !reward || balance(me) < reward.cost) return null;
      const redemption: Redemption = { id: uid(), userId: me, rewardId, code: `EV${code4()}`, at: now() };
      setState((s) => ({
        ...s,
        redemptions: [redemption, ...s.redemptions],
        points: [{ id: uid(), userId: me, amount: -reward.cost, label: reward.id === "donate" ? "Donated to the guarantee pool" : `Redeemed ${reward.title}`, at: now() }, ...s.points],
      }));
      return redemption;
    },
    [state.userId, balance],
  );

  const resetDemo = useCallback(() => setState((s) => ({ ...seedState(), userId: s.userId })), []);

  const value = useMemo<Ctx>(
    () => ({
      ready, state, me, user, vendor, listing, nameOf, balance, signIn, signOut, toggleSave, requestBooking, respondToPost,
      answerRequest, createPost, addListing, setStatus, closeBooking, fillGroup, review, redeem, resetDemo,
    }),
    [ready, state, me, user, vendor, listing, nameOf, balance, signIn, signOut, toggleSave, requestBooking, respondToPost,
      answerRequest, createPost, addListing, setStatus, closeBooking, fillGroup, review, redeem, resetDemo],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

/** WhatsApp link that opens once a request is accepted. The live version sends an intro template to both numbers. */
export function whatsappLink(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
