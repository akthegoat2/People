"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, MessageSquare, Pin, BadgeCheck, Loader2, Send } from "lucide-react";
import type { Post } from "@/lib/people/types";
import { usePeople } from "@/contexts/people-context";
import { useComments } from "@/lib/people/feed-hook";
import { timeAgo } from "@/lib/people/utils";
import { CoreIcon } from "./core-icon";
import { cn } from "@/lib/utils";

export function PostCard({
  post,
  compact,
  onFlame,
}: {
  post: Post;
  compact: boolean;
  onFlame: (id: string) => void;
}) {
  const { cores, alias } = usePeople();
  const [expanded, setExpanded] = useState(false);
  const [flamed, setFlamed] = useState(false);
  const core = cores.find((c) => c.id === post.core_id);
  const { comments, addComment } = useComments(expanded ? post.id : "__closed__");
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleFlame() {
    if (flamed) return;
    setFlamed(true);
    onFlame(post.id);
  }

  async function submitComment() {
    if (!draft.trim() || busy) return;
    setBusy(true);
    try {
      await addComment(alias, draft);
      setDraft("");
    } finally {
      setBusy(false);
    }
  }

  if (compact) {
    return (
      <article className="glass-soft rounded-xl px-3.5 py-2.5 flex items-center gap-3">
        {post.is_pinned && <Pin size={13} className="text-amber-300 shrink-0" />}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] text-slate-100">{post.content}</p>
          <p className="truncate text-[11px] text-slate-400">
            <Link href={`/u/${encodeURIComponent(post.author_alias)}`} className="hover:text-white font-medium">{post.author_alias}</Link>
            {" · "}
            <Link href={`/c/${post.core_id}`} className="hover:text-white">{core?.name ?? post.core_id}</Link>
            {" · "}{timeAgo(post.created_at)}
          </p>
        </div>
        <button onClick={handleFlame} className={cn("flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px]", flamed ? "border-orange-400/50 text-orange-300 bg-orange-400/10" : "border-white/10 text-slate-300 hover:border-orange-400/40")}>
          <Flame size={12} /> {post.flames_count}
        </button>
        <button onClick={() => setExpanded(!expanded)} className="shrink-0 text-slate-400 hover:text-white">
          <MessageSquare size={14} />
        </button>
      </article>
    );
  }

  return (
    <article className="glass rounded-2xl p-4 sm:p-5 transition-all hover:border-white/[0.14]">
      <div className="flex items-center gap-2.5">
        <Link href={`/c/${post.core_id}`} className="flex items-center gap-2 min-w-0">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 shrink-0" style={{ background: core?.gradient ?? "#4f5869" }}>
            <CoreIcon name={core?.icon_name ?? "Hexagon"} size={15} className="text-white" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[12px] font-semibold text-slate-200">{core?.name ?? post.core_id}</span>
            <span className="block text-[11px] text-slate-500">{timeAgo(post.created_at)}</span>
          </span>
        </Link>
        {post.is_pinned && (
          <span className="ml-auto flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
            <Pin size={11} /> Pinned
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-[10px] font-bold text-slate-200">
          {post.author_alias.slice(0, 2).toUpperCase()}
        </span>
        <Link href={`/u/${encodeURIComponent(post.author_alias)}`} className="flex items-center gap-1 text-[12.5px] font-semibold text-slate-100 hover:text-white">
          {post.author_alias}
          <BadgeCheck size={13} className="text-slate-500" />
        </Link>
      </div>

      <p className="mt-2.5 whitespace-pre-wrap text-[14px] leading-relaxed text-slate-200">{post.content}</p>

      <div className="mt-3.5 flex items-center gap-2 border-t border-white/[0.06] pt-3">
        <button
          onClick={handleFlame}
          className={cn(
            "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12.5px] font-semibold transition-all active:scale-95",
            flamed
              ? "border-orange-400/50 bg-orange-400/10 text-orange-300"
              : "border-white/10 text-slate-300 hover:border-orange-400/40 hover:text-orange-300"
          )}
        >
          <Flame size={14} /> {post.flames_count}
          <span className="hidden sm:inline font-normal text-slate-500">flames</span>
        </button>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-[12.5px] text-slate-300 hover:border-white/25"
        >
          <MessageSquare size={14} /> {expanded ? "Hide" : "Discuss"}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2.5 border-t border-white/[0.06] pt-3">
          {comments.map((c) => (
            <div key={c.id} className="glass-soft rounded-xl px-3 py-2">
              <p className="flex items-center gap-1.5 text-[11.5px]">
                <Link href={`/u/${encodeURIComponent(c.author_alias)}`} className="font-semibold text-slate-200 hover:text-white">{c.author_alias}</Link>
                <span className="text-slate-500">{timeAgo(c.created_at)}</span>
              </p>
              <p className="mt-1 text-[13px] text-slate-300 whitespace-pre-wrap">{c.content}</p>
            </div>
          ))}
          {comments.length === 0 && <p className="text-[12px] text-slate-500">No replies yet — open the discourse.</p>}
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitComment(); }}
              placeholder={`Reply as ${alias}...`}
              maxLength={2000}
              className="glass-input flex-1 text-[13px]"
            />
            <button onClick={submitComment} disabled={busy || !draft.trim()} className="glass-btn-primary glass-btn !px-3 disabled:opacity-40">
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
