"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { usePeople } from "@/contexts/people-context";
import { CoreIcon } from "./core-icon";

export function Composer({ onPost }: { onPost: (coreId: string, content: string) => Promise<unknown> }) {
  const { alias, cores, activeCoreId, setActiveCoreId } = usePeople();
  const [coreId, setCoreId] = useState(activeCoreId ?? cores[0]?.id ?? "");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  const active = cores.find((c) => c.id === (activeCoreId ?? coreId));

  async function submit() {
    const target = activeCoreId ?? coreId;
    if (!content.trim() || !target || busy) return;
    setBusy(true);
    try {
      await onPost(target, content);
      setContent("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#8b97ad] to-[#4f5869] text-xs font-bold text-white">
          {alias.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-white">{alias}</p>
          <p className="text-[11px] text-slate-400">Posting pseudonymously · AES-256</p>
        </div>
        <select
          value={activeCoreId ?? coreId}
          onChange={(e) => {
            setCoreId(e.target.value);
            setActiveCoreId(e.target.value);
          }}
          className="glass-input ml-auto max-w-[180px] truncate text-xs"
          aria-label="Select Core"
        >
          {cores.map((c) => (
            <option key={c.id} value={c.id} className="bg-[#0f1319]">
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`Speak freely in ${active?.name ?? "the commons"}... (max 5000 chars)`}
        rows={3}
        maxLength={5000}
        className="glass-input mt-3 w-full resize-y min-h-[84px] leading-relaxed"
      />
      <div className="mt-2.5 flex items-center gap-2">
        {active && (
          <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <CoreIcon name={active.icon_name} size={13} />
            {active.name}
          </span>
        )}
        <span className="ml-auto text-[11px] text-slate-500">{content.length}/5000</span>
        <button onClick={submit} disabled={busy || !content.trim()} className="glass-btn-primary glass-btn flex items-center gap-1.5 disabled:opacity-40">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          Transmit
        </button>
      </div>
    </div>
  );
}
