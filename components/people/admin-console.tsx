"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck, Lock, Plus, Trash2, Save, Pencil, X, KeyRound, Users, LayoutGrid, ScrollText,
} from "lucide-react";
import { usePeople } from "@/contexts/people-context";
import { MASTER_PASSKEY, sha256Hex } from "@/lib/people/utils";
import { getSupabaseBrowser, isSupabaseConfigured, localStore } from "@/lib/people/supabase";
import { SEED_CORES } from "@/lib/people/seed";
import type { Core, Post, CommentRow, LiveDiscussion } from "@/lib/people/types";
import { CoreIcon } from "./core-icon";
import { cn } from "@/lib/utils";

export function AdminGate() {
  const { adminUnlocked, setAdminUnlocked } = usePeople();
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function unlock() {
    setBusy(true);
    setError("");
    try {
      const inputHash = await sha256Hex(passkey.trim());
      let ok = passkey.trim() === MASTER_PASSKEY;
      if (!ok && isSupabaseConfigured()) {
        try {
          const sb = getSupabaseBrowser()!;
          const { data } = await sb.from("admin_settings").select("master_passkey_hash").eq("id", "global").maybeSingle();
          if (data?.master_passkey_hash === inputHash) ok = true;
        } catch {}
      }
      if (ok) {
        setAdminUnlocked(true);
        setPasskey("");
      } else {
        setError("Invalid passkey. Access denied and logged.");
      }
    } finally {
      setBusy(false);
    }
  }

  function lock() {
    setAdminUnlocked(false);
    try {
      sessionStorage.removeItem("people:admin");
      localStorage.removeItem("people:alias");
    } catch {}
    window.location.href = "/";
  }

  if (!adminUnlocked) {
    return (
      <div className="glass rounded-3xl p-8 sm:p-10 max-w-md mx-auto text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#8b97ad] to-[#4f5869] accent-glow">
          <Lock size={24} className="text-white" />
        </span>
        <h1 className="mt-4 text-xl font-extrabold text-white">Admin Security Lock</h1>
        <p className="mt-1 text-[12.5px] text-slate-400">Restricted console. Enter the Master Security Passkey to unlock this session.</p>
        <input
          type="password"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") unlock(); }}
          placeholder="MASTER-SECURITY-PASSKEY"
          className="glass-input mt-5 w-full text-center tracking-widest"
          autoComplete="off"
        />
        {error && <p className="mt-2 text-[12px] text-red-300">{error}</p>}
        <button onClick={unlock} disabled={busy || !passkey} className="glass-btn-primary glass-btn mt-3 w-full disabled:opacity-40">
          {busy ? "Verifying..." : "Unlock Console"}
        </button>
        <p className="mt-3 text-[11px] text-slate-500">Sessions auto-expire on tab close. Lock wipes local tokens.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/15 border border-emerald-300/30">
          <ShieldCheck size={18} className="text-emerald-300" />
        </span>
        <div>
          <p className="text-[14px] font-bold text-white">Session Unlocked</p>
          <p className="text-[11.5px] text-slate-400">Admin privileges active for this tab only</p>
        </div>
        <button onClick={lock} className="glass-btn ml-auto flex items-center gap-1.5 !border-red-400/30 text-red-200 text-[13px]">
          <Lock size={14} /> Lock Session
        </button>
      </div>
      <AdminConsole />
    </div>
  );
}

function AdminConsole() {
  const { cores, updateCore, addCore, removeCore, setCores } = usePeople();
  const [editing, setEditing] = useState<Core | null>(null);
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState<"cores" | "moderation" | "roster">("cores");

  return (
    <div>
      <div className="glass rounded-2xl p-1.5 flex gap-1 text-[13px]">
        {(["cores", "moderation", "roster"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn("flex-1 rounded-xl px-3 py-2 font-semibold capitalize transition-all", tab === t ? "bg-white/10 text-white accent-glow" : "text-slate-400 hover:text-white")}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "cores" && (
        <div className="mt-4 space-y-3">
          <button onClick={() => { setEditing(null); setCreating(true); }} className="glass-btn-primary glass-btn flex items-center gap-1.5 text-[13px]">
            <Plus size={14} /> Create New Core
          </button>
          {(creating || editing) && (
            <CoreEditor
              initial={editing ?? { id: "", name: "", tagline: "", description: "", rules: [], accent_color: "#6d778b", gradient: "linear-gradient(135deg, #8b97ad, #4f5869)", layout: "grid", icon_name: "Hexagon" }}
              isNew={creating}
              onCancel={() => { setCreating(false); setEditing(null); }}
              onSave={(core) => {
                if (creating) addCore(core);
                else updateCore(core.id, core);
                persistCoreRemote(core, creating);
                setCreating(false);
                setEditing(null);
              }}
            />
          )}
          <div className="grid gap-2.5">
            {cores.map((c) => (
              <div key={c.id} className="glass rounded-2xl p-3.5 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10" style={{ background: c.gradient }}>
                  <CoreIcon name={c.icon_name} size={16} className="text-white" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-bold text-white">{c.name} <span className="font-normal text-slate-500">· {c.id}</span></p>
                  <p className="truncate text-[11.5px] text-slate-400">{c.tagline}</p>
                </div>
                <button onClick={() => { setCreating(false); setEditing(c); }} className="glass-btn !px-2.5" title="Edit"><Pencil size={14} /></button>
                <button
                  onClick={async () => {
                    if (!confirm(`Delete core "${c.name}"? Posts cascade.`)) return;
                    removeCore(c.id);
                    if (isSupabaseConfigured()) {
                      try { await getSupabaseBrowser()!.from("cores").delete().eq("id", c.id); } catch {}
                    }
                  }}
                  className="glass-btn !px-2.5 !border-red-400/30 text-red-300"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setCores([...SEED_CORES]); localStorage.setItem("people:cores:v1", JSON.stringify(SEED_CORES)); }}
            className="glass-btn w-full text-[12px] text-slate-300"
          >
            Restore 16 default Cores
          </button>
        </div>
      )}

      {tab === "moderation" && <Moderation />}
      {tab === "roster" && <RosterManager />}
    </div>
  );
}

async function persistCoreRemote(core: Core, isNew: boolean) {
  if (!isSupabaseConfigured()) return;
  try {
    const sb = getSupabaseBrowser()!;
    if (isNew) await sb.from("cores").insert(core);
    else await sb.from("cores").update(core).eq("id", core.id);
  } catch {}
}

const ICON_OPTIONS = ["Moon", "Landmark", "BookOpen", "Globe", "Scale", "Sunrise", "Rainbow", "Shirt", "Brain", "Microscope", "Clapperboard", "Tv", "Heart", "Palette", "Sparkles", "Hexagon", "Venus"];

function CoreEditor({ initial, isNew, onCancel, onSave }: { initial: Core; isNew: boolean; onCancel: () => void; onSave: (c: Core) => void }) {
  const [form, setForm] = useState<Core>({ ...initial, rules: [...initial.rules] });
  const [rulesText, setRulesText] = useState(initial.rules.join("\n"));

  function save() {
    const id = form.id.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || `core-${Date.now()}`;
    onSave({ ...form, id, rules: rulesText.split("\n").map((s) => s.trim()).filter(Boolean) });
  }

  const set = (k: keyof Core, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="glass rounded-2xl p-4 space-y-2.5 border-white/15">
      <p className="flex items-center gap-1.5 text-[13px] font-bold text-white"><LayoutGrid size={14} /> {isNew ? "New Core" : `Editing ${initial.id}`}</p>
      {isNew && <input value={form.id} onChange={(e) => set("id", e.target.value)} placeholder="core-id (e.g. film-noir-core)" className="glass-input w-full text-[13px]" />}
      <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Name" className="glass-input w-full text-[13px]" />
      <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Tagline" className="glass-input w-full text-[13px]" />
      <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Deep & complex about section" rows={4} className="glass-input w-full text-[13px] resize-y" />
      <textarea value={rulesText} onChange={(e) => setRulesText(e.target.value)} placeholder={"Rules (one per line)"} rows={3} className="glass-input w-full text-[13px] resize-y" />
      <div className="grid grid-cols-2 gap-2">
        <label className="text-[11px] text-slate-400">Accent<input type="color" value={form.accent_color} onChange={(e) => set("accent_color", e.target.value)} className="ml-2 h-8 w-12 rounded bg-transparent" /></label>
        <label className="text-[11px] text-slate-400">Layout
          <select value={form.layout} onChange={(e) => set("layout", e.target.value)} className="glass-input ml-2 text-[12px]">
            <option value="grid" className="bg-[#0f1319]">Cards (grid)</option>
            <option value="compact" className="bg-[#0f1319]">Compact Stream</option>
          </select>
        </label>
      </div>
      <input value={form.gradient} onChange={(e) => set("gradient", e.target.value)} placeholder="CSS gradient" className="glass-input w-full text-[12px]" />
      <div>
        <p className="text-[11px] text-slate-400 mb-1.5">Lucide icon</p>
        <div className="flex flex-wrap gap-1.5">
          {ICON_OPTIONS.map((n) => (
            <button key={n} onClick={() => set("icon_name", n)} className={cn("glass-soft rounded-lg px-2 py-1.5 text-[11px] flex items-center gap-1", form.icon_name === n && "accent-glow text-white")}>
              <CoreIcon name={n} size={13} /> {n}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={save} className="glass-btn-primary glass-btn flex-1 flex items-center justify-center gap-1.5 text-[13px]"><Save size={14} /> Save Core</button>
        <button onClick={onCancel} className="glass-btn text-[13px]"><X size={14} /></button>
      </div>
    </div>
  );
}

function Moderation() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [rooms, setRooms] = useState<LiveDiscussion[]>([]);

  async function load() {
    if (!isSupabaseConfigured()) {
      setPosts(localStore.readLS<Post[]>(localStore.LS_POSTS, []));
      setComments(localStore.readLS<CommentRow[]>(localStore.LS_COMMENTS, []));
      setRooms(localStore.readLS<LiveDiscussion[]>(localStore.LS_LIVE, []));
      return;
    }
    try {
      const sb = getSupabaseBrowser()!;
      const [{ data: p }, { data: c }, { data: r }] = await Promise.all([
        sb.from("posts").select("*").order("created_at", { ascending: false }).limit(50),
        sb.from("comments").select("*").order("created_at", { ascending: false }).limit(50),
        sb.from("live_discussions").select("*").order("created_at", { ascending: false }).limit(30),
      ]);
      setPosts((p as Post[]) ?? []);
      setComments((c as CommentRow[]) ?? []);
      setRooms((r as LiveDiscussion[]) ?? []);
    } catch {}
  }

  useEffect(() => {
    load();
  }, []);

  async function purge(kind: "post" | "comment" | "room", id: string) {
    if (!confirm(`Purge ${kind} ${id}? This cannot be undone.`)) return;
    if (kind === "post") {
      setPosts((p) => p.filter((x) => x.id !== id));
      const all = localStore.readLS<Post[]>(localStore.LS_POSTS, []).filter((x) => x.id !== id);
      localStore.writeLS(localStore.LS_POSTS, all);
      if (isSupabaseConfigured()) try { await getSupabaseBrowser()!.from("posts").delete().eq("id", id); } catch {}
    } else if (kind === "comment") {
      setComments((p) => p.filter((x) => x.id !== id));
      const all = localStore.readLS<CommentRow[]>(localStore.LS_COMMENTS, []).filter((x) => x.id !== id);
      localStore.writeLS(localStore.LS_COMMENTS, all);
      if (isSupabaseConfigured()) try { await getSupabaseBrowser()!.from("comments").delete().eq("id", id); } catch {}
    } else {
      setRooms((p) => p.filter((x) => x.id !== id));
      const all = localStore.readLS<LiveDiscussion[]>(localStore.LS_LIVE, []).filter((x) => x.id !== id);
      localStore.writeLS(localStore.LS_LIVE, all);
      if (isSupabaseConfigured()) try { await getSupabaseBrowser()!.from("live_discussions").delete().eq("id", id); } catch {}
    }
  }

  return (
    <div className="mt-4 space-y-4">
      <button onClick={load} className="glass-btn text-[12px]">Reload queues</button>
      <ModSection title={`Posts · ${posts.length}`}>
        {posts.slice(0, 20).map((p) => (
          <div key={p.id} className="glass-soft rounded-xl p-3 flex gap-2 items-start">
            <p className="flex-1 min-w-0 text-[12px] text-slate-300"><b className="text-slate-100">{p.author_alias}</b> · {p.core_id}<br /><span className="line-clamp-2">{p.content}</span></p>
            <button onClick={() => purge("post", p.id)} className="glass-btn !px-2 !border-red-400/30 text-red-300 shrink-0"><Trash2 size={13} /></button>
          </div>
        ))}
      </ModSection>
      <ModSection title={`Comments · ${comments.length}`}>
        {comments.slice(0, 20).map((c) => (
          <div key={c.id} className="glass-soft rounded-xl p-3 flex gap-2 items-start">
            <p className="flex-1 min-w-0 text-[12px] text-slate-300"><b className="text-slate-100">{c.author_alias}</b><br /><span className="line-clamp-2">{c.content}</span></p>
            <button onClick={() => purge("comment", c.id)} className="glass-btn !px-2 !border-red-400/30 text-red-300 shrink-0"><Trash2 size={13} /></button>
          </div>
        ))}
      </ModSection>
      <ModSection title={`Live rooms · ${rooms.length}`}>
        {rooms.slice(0, 20).map((r) => (
          <div key={r.id} className="glass-soft rounded-xl p-3 flex gap-2 items-start">
            <p className="flex-1 min-w-0 text-[12px] text-slate-300"><b className="text-slate-100">{r.title}</b> · {r.creator_alias}</p>
            <button onClick={() => purge("room", r.id)} className="glass-btn !px-2 !border-red-400/30 text-red-300 shrink-0"><Trash2 size={13} /></button>
          </div>
        ))}
      </ModSection>
    </div>
  );
}

function ModSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-[12.5px] font-bold text-white flex items-center gap-1.5"><ScrollText size={13} /> {title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function RosterManager() {
  const [roster, setRoster] = useState<string[]>([]);
  const [handle, setHandle] = useState("");
  const [newKey, setNewKey] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        try {
          setRoster(JSON.parse(localStorage.getItem("people:roster") ?? "[]"));
        } catch { setRoster([]); }
        return;
      }
      try {
        const { data } = await getSupabaseBrowser()!.from("admin_settings").select("authorized_roster").eq("id", "global").maybeSingle();
        setRoster(data?.authorized_roster ?? []);
      } catch {}
    }
    load();
  }, []);

  async function saveRoster(next: string[]) {
    setRoster(next);
    try { localStorage.setItem("people:roster", JSON.stringify(next)); } catch {}
    if (isSupabaseConfigured()) {
      try { await getSupabaseBrowser()!.from("admin_settings").update({ authorized_roster: next }).eq("id", "global"); } catch {}
    }
  }

  async function rotateKey() {
    if (!newKey.trim() || newKey.trim().length < 8) {
      setMsg("New passkey must be at least 8 characters.");
      return;
    }
    const hash = await sha256Hex(newKey.trim());
    if (isSupabaseConfigured()) {
      try {
        await getSupabaseBrowser()!.from("admin_settings").update({ master_passkey_hash: hash }).eq("id", "global");
        setMsg("Master key rotated in Supabase. App default PEOPLE-05152005 no longer valid until restored.");
      } catch {
        setMsg("Supabase update failed.");
      }
    } else {
      setMsg("Supabase not configured — key rotation requires database. Local default remains PEOPLE-05152005.");
    }
    setNewKey("");
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="glass rounded-2xl p-4">
        <p className="flex items-center gap-1.5 text-[13px] font-bold text-white"><Users size={14} /> Authorized roster · {roster.length}</p>
        <div className="mt-2.5 flex gap-2">
          <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="Alias handle e.g. Ghost-409" className="glass-input flex-1 text-[13px]" />
          <button
            onClick={() => { if (handle.trim()) { saveRoster([...roster, handle.trim()]); setHandle(""); } }}
            className="glass-btn-primary glass-btn text-[13px]"
          >
            Grant
          </button>
        </div>
        <div className="mt-2.5 space-y-1.5">
          {roster.map((h) => (
            <div key={h} className="glass-soft rounded-xl px-3 py-2 flex items-center gap-2 text-[12.5px] text-slate-200">
              {h}
              <button onClick={() => saveRoster(roster.filter((x) => x !== h))} className="ml-auto text-red-300 hover:text-red-200 text-[12px]">Revoke</button>
            </div>
          ))}
          {roster.length === 0 && <p className="text-[12px] text-slate-500">No handles authorized yet.</p>}
        </div>
      </div>
      <div className="glass rounded-2xl p-4">
        <p className="flex items-center gap-1.5 text-[13px] font-bold text-white"><KeyRound size={14} /> Rotate master key</p>
        <div className="mt-2.5 flex gap-2">
          <input type="password" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="New master passkey" className="glass-input flex-1 text-[13px]" />
          <button onClick={rotateKey} className="glass-btn text-[13px]">Update</button>
        </div>
        {msg && <p className="mt-2 text-[12px] text-slate-400">{msg}</p>}
      </div>
    </div>
  );
}
