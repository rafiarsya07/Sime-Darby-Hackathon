"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Avatar, Button } from "@/components/ui";
import { CheckIcon } from "@/components/Icons";
import { DEMO_ACCOUNTS, USERS } from "@/lib/data";
import { useStore } from "@/lib/store";

/** The QR poster at the clubhouse lands here. SDP PRIME is simulated with two demo residents. */
export default function SignInPage() {
  const { ready, me, signIn } = useStore();
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "pick" | "checking">("intro");
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    if (ready && me && step === "intro") router.replace("/home");
  }, [ready, me, step, router]);

  function choose(id: string) {
    setPicked(id);
    setStep("checking");
    setTimeout(() => {
      signIn(id);
      router.push("/home");
    }, 1400);
  }

  const person = USERS.find((u) => u.id === picked);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-5 pb-8">
      <div className="flex h-11 items-center">
        <Logo />
      </div>

      <Houses />

      {step === "intro" ? (
        <>
          <h1 className="mt-10 text-[28px] leading-tight font-semibold tracking-[-0.02em]">Hi, neighbour.</h1>
          <p className="mt-2.5 text-[16px] leading-relaxed text-ink-2">
            TownLoop is for people who live in Elmina Valley. Sign in with your SDP PRIME account and we&apos;ll check your
            address for you.
          </p>
          <p className="mt-3.5 text-[14px] text-muted">Your neighbours only see your first name and street.</p>
          <div className="mt-auto pt-10">
            <Button className="w-full" onClick={() => setStep("pick")}>
              Continue with SDP PRIME
            </Button>
            <p className="mt-3.5 text-center text-[13px] text-muted">
              Not a resident? <Link href="/" className="font-medium text-ink underline underline-offset-2">See how TownLoop works</Link>
            </p>
          </div>
        </>
      ) : null}

      {step === "pick" ? (
        <>
          <h1 className="mt-10 text-[24px] font-semibold tracking-[-0.02em]">Choose a demo resident</h1>
          <p className="mt-2 text-[15px] text-ink-2">In the real app this is your own SDP PRIME login.</p>
          <ul className="mt-5 border-t border-line">
            {DEMO_ACCOUNTS.map((a) => {
              const u = USERS.find((x) => x.id === a.id)!;
              return (
                <li key={a.id} className="border-b border-line">
                  <button
                    onClick={() => choose(a.id)}
                    className="flex w-full items-center gap-3.5 py-4 text-left hover:bg-surface/60"
                  >
                    <Avatar name={u.name} size={44} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[16px] font-semibold">{u.name}</span>
                      <span className="block text-[13px] text-muted">
                        {u.street} · {a.note}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button onClick={() => setStep("intro")} className="mt-auto pt-8 text-[14px] font-medium text-muted">
            Back
          </button>
        </>
      ) : null}

      {step === "checking" && person ? (
        <div className="mt-10" role="status" aria-live="polite">
          <h1 className="text-[24px] font-semibold tracking-[-0.02em]">Checking your address…</h1>
          <ul className="mt-5 space-y-3 text-[15px]">
            <li className="flex items-center gap-3"><CheckIcon size={20} /> Signed in as {person.name}</li>
            <li className="flex items-center gap-3"><CheckIcon size={20} /> {person.tenure} at {person.street}</li>
            <li className="flex items-center gap-3 text-muted"><span className="flex size-5 items-center justify-center"><span className="size-2 animate-pulse rounded-full bg-ember" /></span> Matching to {person.precinct}</li>
          </ul>
        </div>
      ) : null}
    </main>
  );
}

function Houses() {
  return (
    <svg viewBox="0 0 342 132" role="img" aria-label="Three landed homes, one with an orange door" className="mt-12 w-full">
      <path d="M0 131H342" stroke="#ECECEC" strokeWidth="1.5" />
      <g fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M18 131V70l50-32 50 32v61" />
        <path d="M118 131V70l50-32 50 32v61" />
        <path d="M218 131V70l50-32 50 32v61" />
        <rect x="36" y="78" width="22" height="16" rx="2" />
        <rect x="78" y="78" width="22" height="16" rx="2" />
        <rect x="36" y="103" width="22" height="28" rx="2" />
        <rect x="136" y="78" width="22" height="16" rx="2" />
        <rect x="178" y="78" width="22" height="16" rx="2" />
        <rect x="178" y="103" width="22" height="16" rx="2" />
        <rect x="236" y="78" width="22" height="16" rx="2" />
        <rect x="278" y="78" width="22" height="16" rx="2" />
        <rect x="236" y="103" width="22" height="28" rx="2" />
      </g>
      <rect x="136" y="103" width="22" height="28" rx="2" fill="#F26B2E" stroke="#1A1A1A" strokeWidth="1.5" />
    </svg>
  );
}
