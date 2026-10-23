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
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-sm">
      <Container>
        <div className="flex h-15 items-center gap-6">
          <Logo href="/home" />
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {[
              { href: "/home", label: "Home", active: pathname === "/home" || pathname.startsWith("/item") },
              { href: "/posts", label: "Posts", active: pathname.startsWith("/post") },
              { href: "/bookings", label: "Bookings", active: pathname.startsWith("/booking") },
            ].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={n.active ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 text-[14px] font-medium hover:bg-surface ${n.active ? "text-ink" : "text-muted"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {me ? (
              <Link
                href="/me/points"
                className="hidden h-9 items-center gap-1.5 rounded-full border border-line px-3 text-[13px] font-semibold hover:border-line-strong sm:inline-flex"
              >
                <span className="size-[7px] rounded-full bg-ember" aria-hidden="true" />
                {fmtPoints(balance(me.id))} pts
              </Link>
            ) : null}
            <Link
              href="/list"
              className="press hidden h-9 items-center gap-1.5 rounded-[10px] bg-ink px-3.5 text-[14px] font-semibold text-white hover:bg-[#333] md:inline-flex"
            >
              <AddIcon size={16} />
              List
            </Link>
            {me ? (
              <Link href="/me" aria-label={`${me.name}, your account${pending ? `, ${pending} new requests` : ""}`} className="relative rounded-full">
                <Avatar name={me.name} size={36} />
                {pending ? (
                  <span className="absolute -top-0.5 -right-0.5 flex size-[18px] items-center justify-center rounded-full bg-ember text-[10px] font-bold text-white ring-2 ring-white">
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

/** Phone navigation: Home, List, Bookings, Me. */
export function BottomNav() {
  const pathname = usePathname().replace(/(.)\/$/, "$1");
  const pending = usePendingCount();
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <ul className="flex">
        {NAV.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          const badge = href === "/me" ? pending : 0;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] ${active ? "font-semibold text-ink" : "font-medium text-muted"}`}
              >
                <span className="relative">
                  <Icon size={23} />
                  {badge ? (
                    <span className="absolute -top-1 -right-2 flex size-4 items-center justify-center rounded-full bg-ember text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  ) : null}
                </span>
                {label}
                {badge ? <span className="sr-only">, {badge} new requests</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
