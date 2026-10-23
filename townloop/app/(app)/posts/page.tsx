"use client";

import { useState } from "react";
import { PostCard } from "@/components/Cards";
import { RespondSheet } from "@/components/People";
import { AddIcon } from "@/components/Icons";
import { Empty, LinkButton, Page } from "@/components/ui";
import { useStore } from "@/lib/store";
import type { Post, Tier } from "@/lib/types";

const FILTERS: { id: Tier | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "rent", label: "Items" },
  { id: "gigs", label: "Help" },
  { id: "vendors", label: "Vendors" },
];

export default function PostsPage() {
  const { state, me } = useStore();
  const [filter, setFilter] = useState<Tier | "all">("all");
  const [replyTo, setReplyTo] = useState<Post | null>(null);
  if (!me) return null;

  const posts = state.posts
    .filter((p) => p.status !== "closed" && (filter === "all" || p.tier === filter))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <Page>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em]">Posts</h1>
          <p className="mt-1 text-[14px] text-muted">What neighbours are looking for. Have it? Request to chat.</p>
        </div>
        <LinkButton href="/posts/new" size="sm" className="shrink-0">
          <AddIcon size={16} /> Post
        </LinkButton>
      </div>

      <div className="mt-5 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] ${filter === f.id ? "border-ink bg-ink font-medium text-white" : "border-line-strong hover:border-ink"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {posts.length ? (
        <div className="mt-2">{posts.map((p) => <PostCard key={p.id} p={p} onRespond={() => setReplyTo(p)} />)}</div>
      ) : (
        <Empty title="No posts here yet" />
      )}

      <RespondSheet post={replyTo} open={!!replyTo} onClose={() => setReplyTo(null)} />
    </Page>
  );
}
