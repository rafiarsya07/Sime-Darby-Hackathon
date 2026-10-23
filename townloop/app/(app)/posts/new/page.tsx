"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, inputClass, Page, TextField } from "@/components/ui";
import { addDays, isoDate, nextSaturday } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Art, Tier } from "@/lib/types";

const KINDS: { id: Tier; label: string; note: string; art: Art; example: string }[] = [
  { id: "rent", label: "Borrow an item", note: "Blazer, high chair, tent, anything", art: "other", example: "Party blazer, size M" },
  { id: "gigs", label: "Get help", note: "A neighbour for a small job", art: "lawn", example: "Mow my lawn on Saturday" },
  { id: "vendors", label: "Find a vendor", note: "Aircond, solar, plumbing, pest", art: "aircond", example: "Aircond servicing for 3 units" },
];

/** Picks an illustration from the words in the title. */
function guessArt(title: string, fallback: Art): Art {
  const t = title.toLowerCase();
  const pairs: [RegExp, Art][] = [
    [/blazer|suit|dress|shirt|baju/, "blazer"], [/chair|stroller|baby|pram/, "stroller"], [/tent|canopy|party/, "tent"],
    [/ladder/, "ladder"], [/drill|tool/, "drill"], [/mow|lawn|grass/, "lawn"], [/aircond|aircon/, "aircond"], [/solar/, "solar"],
    [/pipe|leak|plumb|sink/, "plumbing"], [/termite|pest|ant|cockroach/, "pest"], [/gutter|roof/, "gutter"], [/cat|dog|pet/, "pet"],
    [/tuition|tutor|math/, "tutor"], [/laptop|wifi|computer/, "it"], [/cook|lunch|food/, "cook"], [/wash|clean/, "cleaning"],
    [/racket|badminton|ball/, "racket"], [/massag/, "massager"],
  ];
  return pairs.find(([re]) => re.test(t))?.[1] ?? fallback;
}

export default function NewPostPage() {
  const router = useRouter();
  const { createPost } = useStore();
  const sat = nextSaturday();
  const [tier, setTier] = useState<Tier>("rent");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [budget, setBudget] = useState("");
  const [when, setWhen] = useState("This Saturday");
  const [from, setFrom] = useState(isoDate(sat));
  const [errors, setErrors] = useState<{ title?: string; details?: string }>({});
  const k = KINDS.find((x) => x.id === tier)!;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (title.trim().length < 4) next.title = "What are you looking for?";
    if (!details.trim()) next.details = "A line or two helps neighbours decide.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const id = createPost({
      tier,
      title: title.trim(),
      details: details.trim(),
      budget: budget === "" ? (tier === "rent" ? 0 : undefined) : Number(budget),
      when: when.trim() || "Flexible",
      from,
      to: isoDate(addDays(new Date(from), tier === "rent" ? 1 : 0)),
      art: guessArt(title, k.art),
    });
    if (id) router.push(`/post?id=${id}`);
  }

  return (
    <Page>
      <h1 className="font-display text-[24px] leading-[1.15] font-semibold tracking-[-0.035em]">Post a request</h1>
      <p className="mt-1 text-[14px] text-muted">Neighbours and vendors who can help request to chat. You choose who to talk to.</p>

      <form onSubmit={submit} noValidate className="mt-6 space-y-5">
        <fieldset>
          <legend className="mb-2 text-[14px] font-medium">What do you need?</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {KINDS.map((x) => (
              <label key={x.id} className={`cursor-pointer rounded-[20px] border-2 bg-white px-4 py-3.5 ${tier === x.id ? "border-ember" : "border-transparent hover:border-line-strong"}`}>
                <input type="radio" name="tier" checked={tier === x.id} onChange={() => setTier(x.id)} className="sr-only" />
                <span className="block text-[15px] font-semibold">{x.label}</span>
                <span className="block text-[13px] text-muted">{x.note}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <TextField label="Title" error={errors.title}>
          <input value={title} onChange={(e) => { setTitle(e.target.value); setErrors((x) => ({ ...x, title: undefined })); }} placeholder={k.example} className={inputClass(errors.title)} />
        </TextField>

        <TextField label="Details" error={errors.details}>
          <textarea value={details} onChange={(e) => { setDetails(e.target.value); setErrors((x) => ({ ...x, details: undefined })); }} rows={3} placeholder="Size, how long, anything they should know." className={`${inputClass(errors.details)} h-auto py-3 leading-relaxed`} />
        </TextField>

        <div className="grid grid-cols-2 gap-3">
          <TextField label="When">
            <input value={when} onChange={(e) => setWhen(e.target.value)} placeholder="This Saturday" className={inputClass()} />
          </TextField>
          <TextField label="From">
            <input type="date" value={from} min={isoDate(new Date())} onChange={(e) => e.target.value && setFrom(e.target.value)} className={inputClass()} />
          </TextField>
        </div>

        <TextField label="Budget" hint={tier === "rent" ? "Leave empty if you hope to borrow free" : "Optional"}>
          <span className="flex h-12 items-center rounded-[14px] border border-line-strong bg-white px-3.5 focus-within:border-ink">
            <span className="mr-1.5 text-muted">RM</span>
            <input inputMode="decimal" value={budget} onChange={(e) => setBudget(e.target.value.replace(/[^\d.]/g, ""))} placeholder="20" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
          </span>
        </TextField>

        <Button type="submit" variant="accent" size="lg" className="w-full">Post it</Button>
      </form>
    </Page>
  );
}
