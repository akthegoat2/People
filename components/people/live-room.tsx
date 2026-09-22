"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Users } from "lucide-react";
import { usePeople } from "@/contexts/people-context";
import { useLiveMessages } from "@/lib/people/live-hook";
import { timeAgo } from "@/lib/people/utils";
import Link from "next/link";

export function LiveRoom({ discussionId, title, about, creator }: { discussionId: string; title: string; about: string; creator: string }) {
  const { alias } = usePeople();
  const { messages, send } = useLiveMessages(discussionId);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function submit() {
    if (!draft.trim() || busy) return;
    setBusy(true);
    try {
      await send(alias, draft);
      setDraft("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col min-h-[60vh]">
      <div className="border-b border-white/[0.07] p-4 flex items-center gap-3">
        <span className="live-dot" />
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-bold text-white">{title}</h1>
          <p className="truncate text-[12px] text-slate-400">{about} · host {creator}</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0">
          <Users size={12} /> live
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-4 max-h-[55vh] scrollbar-thin">
        {messages.length === 0 && (
          <p className="text-center text-[12.5px] text-slate-500 py-8">Room is open — say the first thing.</p>
        )}
        {messages.map((m) => {
          const mine = m.sender_alias === alias;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 ${mine ? "bg-gradient-to-br from-[#8b97ad] to-[#4f5869] text-white" : "glass-soft text-slate-200"}`}>
                <p className="text-[10.5px] opacity-70 font-semibold">
                  <Link href={`/u/${encodeURIComponent(m.sender_alias)}`} className="hover:underline">{m.sender_alias}</Link>
                  {" · "}{timeAgo(m.created_at)}
                </p>
                <p className="mt-0.5 text-[13.5px] whitespace-pre-wrap leading-relaxed">{m.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/[0.07] p-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          placeholder={`Transmit as ${alias}...`}
          maxLength={2000}
          className="glass-input flex-1"
        />
        <button onClick={submit} disabled={busy || !draft.trim()} className="glass-btn-primary glass-btn !px-4 disabled:opacity-40">
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        </button>
      </div>
    </div>
  );
}
