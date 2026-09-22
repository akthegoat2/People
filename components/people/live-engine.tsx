"use client";

import { useState } from "react";
import { Plus, Radio, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePeople } from "@/contexts/people-context";
import { useLiveRooms } from "@/lib/people/live-hook";
import { timeAgo } from "@/lib/people/utils";
import { CoreIcon } from "./core-icon";

export function LiveEngine({ coreId }: { coreId?: string | null }) {
  const { alias, cores } = usePeople();
  const { rooms, loading, createRoom } = useLiveRooms(coreId ?? null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [targetCore, setTargetCore] = useState(coreId ?? cores[0]?.id ?? "");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!title.trim() || !targetCore || busy) return;
    setBusy(true);
    try {
      await createRoom({ core_id: targetCore, title: title.trim().slice(0, 140), about: about.trim().slice(0, 500), creator_alias: alias });
      setTitle("");
      setAbout("");
      setShowForm(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-4 flex items-center gap-3">
        <span className="live-dot" />
        <div>
          <p className="text-[14px] font-bold text-white">Live Discussions</p>
          <p className="text-[12px] text-slate-400">Realtime rooms · no refresh needed · {rooms.length} active</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="glass-btn-primary glass-btn ml-auto flex items-center gap-1.5">
          <Plus size={15} /> Open Room
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-4 space-y-2.5">
          <select value={targetCore} onChange={(e) => setTargetCore(e.target.value)} className="glass-input w-full text-sm" aria-label="Core">
            {cores.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0f1319]">{c.name}</option>
            ))}
          </select>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Room title — e.g. Midnight Critique Circle" maxLength={140} className="glass-input w-full" />
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="What is this room about?" rows={2} maxLength={500} className="glass-input w-full resize-y" />
          <button onClick={submit} disabled={busy || !title.trim()} className="glass-btn-primary glass-btn w-full disabled:opacity-40">
            {busy ? <Loader2 size={14} className="animate-spin mx-auto" /> : "Go Live"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="glass rounded-2xl p-6 animate-pulse text-[13px] text-slate-400">Tuning frequencies...</div>
      ) : rooms.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <Radio size={26} className="mx-auto text-slate-500" />
          <p className="mt-2 font-semibold text-slate-200">No live rooms</p>
          <p className="text-[12px] text-slate-400">Open the first room above.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rooms.map((r) => {
            const core = cores.find((c) => c.id === r.core_id);
            return (
              <Link key={r.id} href={`/live/${r.id}`} className="glass rounded-2xl p-4 hover:border-white/[0.16] transition-all group">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10" style={{ background: core?.gradient ?? "#4f5869" }}>
                    <CoreIcon name={core?.icon_name ?? "Radio"} size={15} className="text-white" />
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">{core?.name ?? r.core_id} · {timeAgo(r.created_at)}</span>
                  <span className="live-dot ml-auto" />
                </div>
                <p className="mt-2.5 font-semibold text-[14px] text-white leading-snug group-hover:underline underline-offset-4">{r.title}</p>
                <p className="mt-1 line-clamp-2 text-[12.5px] text-slate-400">{r.about}</p>
                <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Users size={12} /> {r.active_participants} participants · by {r.creator_alias}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
