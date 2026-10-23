"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { fmtPoints } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Logo } from "./Logo";
import { Avatar, Container } from "./ui";
import { AddIcon, BookingsIcon, HomeIcon, ProfileIcon } from "./Icons";

type NavItem = { href: string; label: string; Icon: ComponentType<{ size?: number }>; match: (p: string) => boolean };

const NAV: NavItem[] = [
  { href: "/home", label: "Home", Icon: HomeIcon, match: (p) => p === "/home" || p.startsWith("/item") || p.startsWith("/post") || p.startsWith("/person") },
  { href: "/list", label: "List", Icon: AddIcon, match: (p) => p.startsWith("/list") },
  { href: "/bookings", label: "Bookings", Icon: BookingsIcon, match: (p) => p.startsWith("/booking") },
  { href: "/me", label: "Me", Icon: ProfileIcon, match: (p) => p.startsWith("/me") },
];

/** Pending requests waiting on the signed in resident. */
function usePendingCount() {
  const { me, state } = useStore();
  return state.requests.filter((r) => r.toId === me?.id && r.status === "pending").length;
}

export function AppHeader() {
  const pathname = usePathname().replace(/(.)\/$/, "$1");
  const { me, balance } = useStore();
  const pending = usePendingCount();

  return (
    <header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center gap-6">
          <Logo href="/home" />
          <nav aria-label="Main" className="hidden items-center gap-1 rounded-full bg-white p-1 shadow-[0_1px_0_rgba(0,0,0,0.04)] md:flex">
            {[
              { href: "/home", label: "Home", active: pathname === "/home" || pathname.startsWith("/item") },
              { href: "/posts", label: "Posts", active: pathname.startsWith("/post") },
              { href: "/bookings", label: "Bookings", active: pathname.startsWith("/booking") },
              { href: "/me", label: "Me", active: pathname.startsWith("/me") },
            ].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={n.active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${n.active ? "bg-night text-white" : "text-ink-2 hover:bg-surface"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {me ? (
              <Link
                href="/me/points"
                className="press inline-flex h-10 items-center gap-2 rounded-full bg-white pr-3.5 pl-1.5 text-[13px] font-semibold shadow-[0_1px_0_rgba(0,0,0,0.04)]"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-leaf-wash text-leaf-text" aria-hidden="true">
                  <LeafMini />
                </span>
                <span className="font-display text-[12px] tracking-[-0.01em]">{fmtPoints(balance(me.id))}</span>
              </Link>
            ) : null}
            <Link
              href="/list"
              className="press hidden h-10 items-center gap-1.5 rounded-full bg-ember px-4 text-[14px] font-semibold text-white hover:bg-[#E35D20] md:inline-flex"
            >
              <AddIcon size={16} />
              List
            </Link>
            {me ? (
              <Link href="/me" aria-label={`${me.name}, your account${pending ? `, ${pending} new requests` : ""}`} className="relative hidden rounded-full sm:block">
                <Avatar name={me.name} size={40} />
                {pending ? (
                  <span className="absolute -top-0.5 -right-0.5 flex size-[18px] items-center justify-center rounded-full bg-ember text-[10px] font-bold text-white ring-2 ring-canvas">
                    {pending}
                  </span>
                ) : null}
              </Link>
            ) : null}
          </div>
        </div>
      </Container>
    </header>
  );
}

function LeafMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 16c0-7 4.5-11 12-12 0 7.5-4 12-11 12" fill="currentColor" opacity="0.25" />
      <path d="M4 16c0-7 4.5-11 12-12 0 7.5-4 12-11 12M4 16l6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Phone navigation, a floating night pill: Home, List, Bookings, Me.
 * The current tab grows into a light pill with its label; List is always
 * the orange action button.
 */
export function BottomNav() {
  const pathname = usePathname().replace(/(.)\/$/, "$1");
  const pending = usePendingCount();
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden">
      <ul className="mx-auto flex h-[68px] max-w-md items-center justify-between rounded-full bg-night px-2.5 shadow-[0_12px_32px_-12px_rgba(21,23,28,0.55)]">
        {NAV.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          const badge = href === "/me" ? pending : 0;
          const isList = href === "/list";
          return (
            <li key={href} className={active ? "flex-[1.6]" : "flex-1"}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                aria-label={label}
                className="flex h-[68px] items-center justify-center"
              >
                <span
                  className={`relative flex h-12 items-center justify-center gap-2 rounded-full transition-all duration-200 ${
                    active
                      ? "bg-white px-4 text-ink"
                      : isList
                        ? "w-12 bg-ember text-white"
                        : "w-12 text-white/65"
                  }`}
                >
                  <Icon size={22} />
                  {active ? <span className="text-[13px] font-semibold">{label}</span> : null}
                  {badge ? (
                    <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-ember text-[10px] font-bold text-white ring-2 ring-night">
                      {badge}
                    </span>
                  ) : null}
                </span>
                {badge ? <span className="sr-only">, {badge} new requests</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
