import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ArtTile } from "@/components/Art";
import { Container, LinkButton } from "@/components/ui";
import { AircondIcon, ArrowRightIcon, JetWasherIcon, LendAHandIcon } from "@/components/Icons";

const STEPS = [
  { title: "Browse or post", body: "Tan browses his street, or posts what he needs: a lawn mowed, a party blazer, an aircond service." },
  { title: "Request, then accept", body: "Pak Rahman requests to chat. Tan checks his profile, ratings and past jobs before saying yes." },
  { title: "WhatsApp opens", body: "Only after Tan accepts does TownLoop introduce them on WhatsApp. Numbers stay hidden until then." },
  { title: "Close the loop", body: "Items change hands with a QR scan. 24 hours after the job is done, Eco points land for both." },
];

const TRUST = [
  { title: "Real residents only", body: "Every account is checked against SDP PRIME. No anonymous profiles." },
  { title: "No cold messages", body: "Nobody can chat with you until you accept their request. You see who they are first." },
  { title: "Deposit held first", body: "The borrower's deposit is held before handover. Either side can report a problem within 24 hours." },
  { title: "A township safety net", body: "1.5% of every fee goes into a community fund for repairs bigger than the deposit." },
];

export default function Landing() {
  return (
    <>
      <header className="border-b border-line">
        <Container>
          <div className="flex h-15 flex-wrap items-center gap-x-8 gap-y-2">
            <Logo />
            <nav aria-label="Primary" className="hidden gap-7 text-[15px] text-ink-2 md:flex">
              <a href="#how" className="hover:text-ink">How it works</a>
              <a href="#trust" className="hover:text-ink">Safety</a>
              <a href="#points" className="hover:text-ink">Eco points</a>
              <a href="#sdp" className="hover:text-ink">For SDP</a>
            </nav>
            <LinkButton href="/signin" variant="secondary" size="sm" className="ml-auto">Sign in</LinkButton>
          </div>
        </Container>
      </header>

      <main>
        <Container>
          <section className="flex flex-wrap items-center gap-14 py-14 md:py-24">
            <div className="min-w-0 flex-[999_1_440px]">
              <p className="text-[15px] text-muted">For residents of Elmina Valley</p>
              <h1 className="mt-3.5 font-display text-[clamp(34px,4.6vw,58px)] leading-[1.05] font-semibold tracking-[-0.05em]">
                Borrow from next door, not from a store.
              </h1>
              <p className="mt-5 max-w-[32rem] text-[18px] leading-relaxed text-ink-2">
                Rent the jet washer in Siti&apos;s storeroom. Get Pak Rahman to mow the lawn. Join your street&apos;s aircond group buy.
                Everyone here is a verified SDP resident.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <LinkButton href="/signin">Sign in with SDP PRIME</LinkButton>
                <a href="#how" className="inline-flex items-center gap-1.5 text-[16px] font-semibold">
                  How it works <ArrowRightIcon size={18} />
                </a>
              </div>
            </div>
            <PhonePreview />
          </section>
        </Container>

        <section id="how" className="border-t border-line">
          <Container className="py-16 md:py-24">
            <h2 className="font-display text-[clamp(24px,2.8vw,32px)] font-semibold tracking-[-0.04em]">How it works</h2>
            <ol className="mt-10 grid gap-x-10 gap-y-9 [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="text-[15px] font-semibold text-ember-text">{i + 1}</span>
                  <h3 className="mt-2.5 text-[18px] font-semibold">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{s.body}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section className="bg-[#F7F7F5]">
          <Container className="grid gap-10 py-16 md:py-24 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            <Feature Icon={JetWasherIcon} title="Rent" body="Jet washers, tents, a party blazer, a spare driveway, the BBQ pit at the park. By the day or the night." />
            <Feature Icon={LendAHandIcon} title="Gigs" body="Lawn care, pet sitting, tuition, home cooked lunches. Neighbours earning a little from neighbours." />
            <Feature Icon={AircondIcon} title="Vendors" body="Aircond, solar, pest and plumbing from local and vetted vendors. Book with your street and pay less." />
          </Container>
        </section>

        <Container>
          <section id="trust" className="flex flex-wrap gap-x-16 gap-y-8 py-16 md:py-24">
            <h2 className="flex-[1_1_280px] font-display text-[clamp(24px,2.8vw,32px)] leading-tight font-semibold tracking-[-0.04em]">
              Lending your things shouldn&apos;t feel risky.
            </h2>
            <ul className="flex-[999_1_440px]">
              {TRUST.map((t) => (
                <li key={t.title} className="border-b border-line py-4.5 first:pt-0 last:border-b-0 last:pb-0">
                  <h3 className="text-[17px] font-semibold">{t.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{t.body}</p>
                </li>
              ))}
            </ul>
          </section>
        </Container>

        <section id="points" className="border-t border-line">
          <Container className="flex flex-wrap items-center gap-x-16 gap-y-8 py-16 md:py-24">
            <div className="min-w-0 flex-[1_1_360px]">
              <h2 className="font-display text-[clamp(24px,2.8vw,32px)] leading-tight font-semibold tracking-[-0.04em]">Every loop earns Eco points.</h2>
              <p className="mt-3 max-w-[30rem] text-[16px] leading-relaxed text-ink-2">
                Residents earn the most for renting, hiring and lending free. Spend points at Elmina Lakeside Mall, or take them off your maintenance fees.
              </p>
            </div>
            <div className="min-w-0 flex-[1_1_360px]">
              <p className="flex items-baseline gap-2">
                <span className="text-[44px] font-semibold tracking-[-0.03em]">2,040</span>
                <span className="text-muted">points, Siti</span>
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F0F0EE]">
                <div className="h-full w-[82%] bg-ember" />
              </div>
              <p className="mt-2 text-[14px] text-muted">460 more for RM50 off maintenance fees</p>
            </div>
          </Container>
        </section>

        <section id="sdp" className="bg-ink text-white">
          <Container className="flex flex-wrap items-center justify-between gap-x-12 gap-y-6 py-16 md:py-20">
            <div className="min-w-0 flex-[999_1_420px]">
              <h2 className="font-display text-[clamp(24px,2.8vw,32px)] leading-tight font-semibold tracking-[-0.04em]">
                One QR poster per clubhouse. That&apos;s the rollout.
              </h2>
              <p className="mt-2.5 max-w-[34rem] text-[16px] leading-relaxed text-[#C9C9C9]">
                TownLoop runs on SDP PRIME, so residents are verified from day one and the money they spend stays in the township.
              </p>
            </div>
            <Link href="/signin" className="press inline-flex h-12 items-center rounded-[10px] bg-white px-5 text-[16px] font-semibold text-ink hover:bg-[#EDEDED]">
              Try the Elmina demo
            </Link>
          </Container>
        </section>
      </main>

      <footer>
        <Container className="flex flex-wrap justify-between gap-x-8 gap-y-2 py-7 text-[14px] text-muted">
          <span>A student concept for the Sime Darby Property University Hackathon 2026.</span>
          <span>Made in Kuala Lumpur</span>
        </Container>
      </footer>
    </>
  );
}

function Feature({ Icon, title, body, tag }: { Icon: (p: { size?: number }) => React.ReactNode; title: string; body: string; tag?: string }) {
  return (
    <div>
      <Icon size={32} />
      <h3 className="mt-3.5 text-[20px] font-semibold">
        {title}
        {tag ? <span className="text-[14px] font-medium text-muted"> · {tag}</span> : null}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{body}</p>
    </div>
  );
}

function PhonePreview() {
  const rows = [
    { kind: "washer" as const, title: "Jet washer", meta: "Siti · 180 m", price: "RM30" },
    { kind: "lawn" as const, title: "Lawn mowing", meta: "Pak Rahman · 240 m", price: "RM45" },
    { kind: "aircond" as const, title: "Aircond service", meta: "CoolBreeze · Local", price: "RM90" },
  ];
  return (
    <div className="flex flex-[1_1_300px] justify-center">
      <div className="w-[290px] max-w-full rounded-[40px] border border-[#E4E4E2] bg-white p-2">
        <div className="rounded-[32px] border border-[#F0F0EE] px-[18px] pt-[22px] pb-[26px]">
          <span className="text-[13px] text-muted">Elmina Valley, Phase 3</span>
          <div className="mt-1.5 mb-3.5 text-[19px] font-semibold tracking-[-0.01em]">Good morning, Tan</div>
          <div className="flex h-9 items-center rounded-[9px] bg-surface px-3 text-[13px] text-muted">Search items, help, vendors</div>
          <div className="mt-3 flex gap-4 border-b border-line text-[12px]">
            <span className="-mb-px border-b-2 border-ink py-1.5 font-semibold">For you</span>
            <span className="py-1.5 text-muted">Rent</span>
            <span className="py-1.5 text-muted">Gigs</span>
            <span className="py-1.5 text-muted">Vendors</span>
          </div>
          <ul className="mt-1">
            {rows.map((r) => (
              <li key={r.title} className="flex items-center gap-2.5 border-b border-line py-2.5 last:border-b-0">
                <ArtTile art={r.kind} size={40} />
                <span className="flex-1">
                  <span className="block text-[13px] font-semibold">{r.title}</span>
                  <span className="text-[11px] text-muted">{r.meta}</span>
                </span>
                <span className="text-[13px] font-semibold">{r.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
