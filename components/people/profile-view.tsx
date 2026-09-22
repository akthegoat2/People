"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Flame, MessageSquare, Radio, Lock, RefreshCw } from "lucide-react";
import { getSupabaseBrowser, isSupabaseConfigured, localStore } from "@/lib/people/supabase";
import type { CommentRow, LiveDiscussion, Post } from "@/lib/people/types";
import { timeAgo } from "@/lib/people/utils";
import Link from "next/link";

export function ProfileView({ alias }: { alias: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [rooms, setRooms] = useState<LiveDiscussion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!isSupabaseConfigured()) {
        const p = localStore.readLS<Post[]>(localStore.LS_POSTS, []).filter((x) => x.author_alias === alias);
        const c = localStore.readLS<CommentRow[]>(localStore.LS_COMMENTS, []).filter((x) => x.author_alias === alias);
        const r = localStore.readLS<LiveDiscussion[]>(localStore.LS_LIVE, []).filter((x) => x.creator_alias === alias);
        setPosts(p);
        setComments(c);
        setRooms(r);
        setLoading(false);
        return;
      }
      try {
        const sb = getSupabaseBrowser()!;
        const [{ data: p }, { data: c }, { data: r }] = await Promise.all([
          sb.from("posts").select("*").eq("author_alias", alias).order("created_at", { ascending: false }).limit(50),
          sb.from("comments").select("*").eq("author_alias", alias).order("created_at", { ascending: false }).limit(50),
          sb.from("live_discussions").select("*").eq("creator_alias", alias).order("created_at", { ascending: false }).limit(20),
        ]);
        setPosts((p as Post[]) ?? []);
        setComments((c as CommentRow[]) ?? []);
        setRooms((r as LiveDiscussion[]) ?? []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [alias]);

  const reputation = useMemo(() => posts.reduce((s, p) => s + p.flames_count, 0), [posts]);

  return (
    <div className="space-y-5">
      <section className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(500px 200px at 15% 0%, rgba(139,151,173,0.22), transparent 60%)" }} />
        <div className="relative flex items-start gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#8b97ad] to-[#4f5869] text-xl font-extrabold text-white accent-glow">
            {alias.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-extrabold text-white">{alias}</h1>
            <p className="text-[12.5px] text-slate-400">Pseudonymous citizen · zero-knowledge identity</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="glass-soft rounded-full px-2.5 py-1 flex items-center gap-1 text-amber-200"><Flame size={11} /> {reputation} rep</span>
              <span className="glass-soft rounded-full px-2.5 py-1 flex items-center gap-1 text-emerald-300"><Lock size={11} /> AES-256 Encrypted</span>
              <span className="glass-soft rounded-full px-2.5 py-1 flex items-center gap-1 text-slate-300"><ShieldCheck size={11} /> Zero Logged IPs</span>
            </div>
          </div>
        </div>
        <div className="relative mt-4 grid grid-cols-3 gap-2.5">
          <Stat icon={<Flame size={14} />} value={posts.length} label="Transmissions" />
          <Stat icon={<MessageSquare size={14} />} value={comments.length} label="Replies" />
          <Stat icon={<Radio size={14} />} value={rooms.length} label="Live rooms" />
        </div>
      </section>

      {loading ? (
        <div className="glass rounded-2xl p-6 animate-pulse text-[13px] text-slate-400">Resolving identity...</div>
      ) : (
        <>
          <Section title={`Transmissions · ${posts.length}`}>
            {posts.length === 0 ? <Empty text="No transmissions yet." /> : posts.map((p) => (
              <div key={p.id} className="glass-soft rounded-xl p-3.5">
                <p className="text-[13px] text-slate-200 whitespace-pre-wrap">{p.content}</p>
                <p className="mt-1.5 text-[11px] text-slate-500">
                  <Link href={`/c/${p.core_id}`} className="hover:text-white font-medium">{p.core_id}</Link> · {timeAgo(p.created_at)} · <span className="text-orange-300">{p.flames_count} flames</span>
                </p>
              </div>
            ))}
          </Section>
          <Section title={`Replies · ${comments.length}`}>
            {comments.length === 0 ? <Empty text="No replies yet." /> : comments.map((c) => (
              <div key={c.id} className="glass-soft rounded-xl p-3.5">
                <p className="text-[13px] text-slate-200 whitespace-pre-wrap">{c.content}</p>
                <p className="mt-1.5 text-[11px] text-slate-500">{timeAgo(c.created_at)}</p>
              </div>
            ))}
          </Section>
          <Section title={`Live rooms · ${rooms.length}`}>
            {rooms.length === 0 ? <Empty text="No rooms created." /> : rooms.map((r) => (
              <Link key={r.id} href={`/live/${r.id}`} className="glass-soft rounded-xl p-3.5 block hover:border-white/20">
                <p className="text-[13.5px] font-semibold text-white">{r.title}</p>
                <p className="text-[11px] text-slate-500">{r.core_id} · {timeAgo(r.created_at)}</p>
              </Link>
            ))}
          </Section>
        </>
      )}
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="glass-soft rounded-2xl p-3 text-center">
      <span className="mx-auto flex w-fit items-center gap-1.5 text-slate-200">{icon}<b className="text-[15px]">{value}</b></span>
      <span className="text-[11px] text-slate-400">{label}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2.5 text-[13px] font-bold text-white">{title}</h2>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="glass-soft rounded-xl p-5 text-center text-[12.5px] text-slate-500">{text}</div>;
}

export function RotateAliasButton({ onRotate }: { onRotate: () => void }) {
  return (
    <button onClick={onRotate} className="glass-btn flex items-center gap-1.5 text-[12px]">
      <RefreshCw size={13} /> Rotate alias
    </button>
  );
}
