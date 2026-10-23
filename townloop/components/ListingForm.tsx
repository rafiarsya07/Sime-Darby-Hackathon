"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArtTile } from "./Art";
import { Button, inputClass, Page, TextField } from "./ui";
import { CATEGORIES } from "@/lib/data";
import { unitLabel } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Art, PriceUnit } from "@/lib/types";

const ART_BY_CATEGORY: Record<string, Art> = {
  Cleaning: "washer", Garden: "mower", Tools: "drill", Party: "tent", Kids: "stroller", Wellness: "massager",
  Sports: "racket", Clothing: "blazer", Spaces: "driveway", Food: "cook", Pets: "pet", Tuition: "tutor",
  "IT help": "it", Errands: "carwash",
};

type Kind = "item" | "service";

export function ListingForm({ kind }: { kind: Kind }) {
  const router = useRouter();
  const { addListing, state, me } = useStore();
  const tier = kind === "item" ? "rent" : "gigs";
  const cats = CATEGORIES[tier].filter((c) => c !== "SDP facilities");
  const units: PriceUnit[] = kind === "item" ? ["day", "night", "set"] : ["job", "hour", "slot"];

  const [category, setCategory] = useState(cats[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState<PriceUnit>(units[0]);
  const [deposit, setDeposit] = useState("");
  const [free, setFree] = useState(false);
  const [when, setWhen] = useState(kind === "item" ? "Evenings after 7pm, weekends" : "Weekends");
  const [errors, setErrors] = useState<{ title?: string; price?: string }>({});

  const art = (category === "Garden" && kind === "service" ? "lawn" : ART_BY_CATEGORY[category]) ?? "other";
  const firstListing = me ? !state.listings.some((l) => l.ownerId === me.id) : false;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (title.trim().length < 3) next.title = "Give it a short name.";
    if (!free && !(Number(price) > 0)) next.price = "Set a price, or make it free.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const id = addListing({
      tier,
      title: title.trim(),
      category,
      art,
      price: free ? 0 : Number(price),
      unit,
      deposit: kind === "item" && Number(deposit) > 0 ? Number(deposit) : undefined,
      when: when.trim() || "Ask me",
      description: description.trim() || (kind === "item" ? "Ask me anything about it." : "Message me with the details."),
      free: free || undefined,
    });
    if (id) router.push(`/item?id=${id}`);
  }

  return (
    <Page>
      <h1 className="font-display text-[24px] leading-[1.15] font-semibold tracking-[-0.035em]">{kind === "item" ? "Lend an item or space" : "Offer a service"}</h1>
      {firstListing ? <p className="mt-2 inline-block rounded-full bg-leaf-wash px-3 py-1 text-[12px] font-semibold text-leaf-text">First listing earns +100 points</p> : null}

      <form onSubmit={submit} noValidate className="mt-6 space-y-5">
        <div className="flex items-center gap-4">
          <ArtTile art={art} size={72} />
          <p className="text-[13px] text-muted">Photo comes from the category for now.</p>
        </div>

        <fieldset>
          <legend className="mb-2 text-[14px] font-medium">Category</legend>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] ${category === c ? "border-ember bg-ember font-medium text-white" : "border-transparent bg-white hover:bg-surface"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <TextField label="Title" error={errors.title}>
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors((x) => ({ ...x, title: undefined })); }}
            placeholder={kind === "item" ? "Bosch jet washer" : "Lawn mowing, front and back"}
            className={inputClass(errors.title)}
          />
        </TextField>

        <TextField label="Description" hint="Optional">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder={kind === "item" ? "What's included, condition, any rules." : "What you do, what you bring, how long it takes."} className={`${inputClass()} h-auto py-3 leading-relaxed`} />
        </TextField>

        {kind === "item" ? (
          <label className="flex items-center gap-3 text-[15px]">
            <input type="checkbox" checked={free} onChange={(e) => { setFree(e.target.checked); setErrors((x) => ({ ...x, price: undefined })); }} className="size-5 accent-[#1a1a1a]" />
            Lend it free and earn +40 points each time
          </label>
        ) : null}

        {!free ? (
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Price" error={errors.price}>
              <span className={`flex h-12 items-center rounded-[14px] border bg-white px-3.5 focus-within:border-ink ${errors.price ? "border-[#B42318]" : "border-line-strong"}`}>
                <span className="mr-1.5 text-muted">RM</span>
                <input inputMode="decimal" value={price} onChange={(e) => { setPrice(e.target.value.replace(/[^\d.]/g, "")); setErrors((x) => ({ ...x, price: undefined })); }} placeholder="30" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
              </span>
            </TextField>
            <TextField label="Per">
              <select value={unit} onChange={(e) => setUnit(e.target.value as PriceUnit)} className={inputClass()}>
                {units.map((u) => <option key={u} value={u}>{unitLabel[u]}</option>)}
              </select>
            </TextField>
          </div>
        ) : null}

        {kind === "item" ? (
          <TextField label="Refundable deposit" hint="Optional">
            <span className="flex h-12 items-center rounded-[14px] border border-line-strong bg-white px-3.5 focus-within:border-ink">
              <span className="mr-1.5 text-muted">RM</span>
              <input inputMode="decimal" value={deposit} onChange={(e) => setDeposit(e.target.value.replace(/[^\d.]/g, ""))} placeholder="50" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
            </span>
          </TextField>
        ) : null}

        <TextField label={kind === "item" ? "Pick up times" : "When you're free"}>
          <input value={when} onChange={(e) => setWhen(e.target.value)} className={inputClass()} />
        </TextField>

        <Button type="submit" variant="accent" size="lg" className="w-full">Publish listing</Button>
      </form>
    </Page>
  );
}
