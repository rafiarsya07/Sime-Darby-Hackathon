"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppHeader, BottomNav } from "@/components/AppNav";
import { useStore } from "@/lib/store";

/** Everything behind sign in. Sends signed out visitors to /signin. */
export default function AppLayout({ children }: { children: ReactNode }) {
  const { ready, me } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (ready && !me) router.replace("/signin");
  }, [ready, me, router]);

  return (
    <>
      <AppHeader />
      <main>{ready && me ? children : <div className="h-[60vh]" aria-busy="true" />}</main>
      <BottomNav />
    </>
  );
}
