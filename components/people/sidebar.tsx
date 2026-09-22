"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Radio, ShieldCheck, Compass } from "lucide-react";
import { usePeople } from "@/contexts/people-context";
import { CoreIcon } from "./core-icon";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { cores, activeCoreId, setActiveCoreId, alias } = usePeople();
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-[290px] shrink-0">
      <div className="sticky top-[76px] space-y-4 max-h-[calc(100vh-96px)] overflow-y-auto scrollbar-thin pr-1 pb-6">
        <div className="glass rounded-2xl p-3">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Navigate</p>
          <SideLink href="/" active={pathname === "/"} icon={<Flame size={16} />} label="Stream" desc="All cores, live feed" />
          <SideLink href="/live" active={pathname?.startsWith("/live") ?? false} icon={<Radio size={16} />} label="Live Discussions" desc="Realtime rooms" />
          <SideLink href={`/u/${encodeURIComponent(alias)}`} active={pathname?.startsWith("/u/") ?? false} icon={<Compass size={16} />} label="My Profile" desc={alias} />
          <SideLink href="/admin" active={pathname === "/admin"} icon={<ShieldCheck size={16} />} label="Admin Console" desc="Security gate" />
        </div>

        <div className="glass rounded-2xl p-3">
          <div className="flex items-center justify-between px-2 pb-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Cores · {cores.length}</p>
            {activeCoreId && (
              <button onClick={() => setActiveCoreId(null)} className="text-[11px] text-slate-300 hover:text-white underline underline-offset-4">
                Clear
              </button>
            )}
          </div>
          <div className="space-y-1">
            {cores.map((c) => {
              const active = activeCoreId === c.id;
              return (
                <Link
                  key={c.id}
                  href={`/c/${c.id}`}
                  onClick={() => setActiveCoreId(c.id)}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-2 transition-all",
                    active ? "glass accent-glow" : "hover:bg-white/5"
                  )}
                >
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10"
                    style={{ background: c.gradient }}
                  >
                    <CoreIcon name={c.icon_name} size={15} className="text-white" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-slate-100">{c.name}</span>
                    <span className="block truncate text-[11px] text-slate-400">{c.tagline}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="glass-soft rounded-2xl p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Privacy</p>
          <ul className="mt-2 space-y-1.5 text-[12px] text-slate-300">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> AES-256 Encrypted</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Zero Logged IPs</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Pseudonymous by default</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

function SideLink({ href, active, icon, label, desc }: { href: string; active: boolean; icon: React.ReactNode; label: string; desc: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-2.5 py-2 transition-all border",
        active ? "glass accent-glow border-white/10" : "border-transparent hover:bg-white/5"
      )}
    >
      <span className="text-slate-300">{icon}</span>
      <span>
        <span className="block text-[13px] font-semibold text-slate-100">{label}</span>
        <span className="block max-w-[170px] truncate text-[11px] text-slate-400">{desc}</span>
      </span>
    </Link>
  );
}
