"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame, Radio, Search, ShieldCheck, Users, Menu, X, Zap, RefreshCw, LayoutGrid, List,
} from "lucide-react";
import { useState } from "react";
import { usePeople } from "@/contexts/people-context";
import { CoreIcon } from "./core-icon";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { alias, refreshAlias, cores, search, setSearch, compactMode, setCompactMode } = usePeople();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="glass border-x-0 border-t-0 px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#8b97ad] to-[#4f5869] accent-glow">
              <Users size={18} className="text-white" />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold tracking-tight text-gradient-steel">People</span>
              <span className="block text-[10px] text-slate-400">for the people, by the people</span>
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md items-center gap-2 ml-4">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search discourse, cores, aliases..."
                className="glass-input w-full pl-9"
              />
            </div>
          </div>

          <nav className="ml-auto hidden md:flex items-center gap-1 text-sm">
            <NavLink href="/" active={pathname === "/"} icon={<Flame size={15} />} label="Stream" />
            <NavLink href="/live" active={pathname?.startsWith("/live") ?? false} icon={<Radio size={15} />} label="Live" />
            <NavLink href={`/u/${encodeURIComponent(alias)}`} active={pathname?.startsWith("/u/") ?? false} icon={<Zap size={15} />} label={alias} />
            <NavLink href="/admin" active={pathname === "/admin"} icon={<ShieldCheck size={15} />} label="Admin" />
            <button
              onClick={() => setCompactMode(!compactMode)}
              title={compactMode ? "Card view" : "Compact stream (low-data)"}
              className="glass-btn ml-1 flex items-center gap-1.5 !px-3"
            >
              {compactMode ? <LayoutGrid size={15} /> : <List size={15} />}
              <span className="hidden lg:inline text-xs">{compactMode ? "Cards" : "Compact"}</span>
            </button>
            <button onClick={refreshAlias} title="Rotate pseudonym" className="glass-btn !px-2.5">
              <RefreshCw size={15} />
            </button>
          </nav>

          <button className="glass-btn ml-auto md:hidden !px-2.5" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-3 space-y-2 pb-1">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search discourse..."
                className="glass-input w-full pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <MobileLink href="/" label="Stream" />
              <MobileLink href="/live" label="Live Discussions" />
              <MobileLink href={`/u/${encodeURIComponent(alias)}`} label={alias} />
              <MobileLink href="/admin" label="Admin Console" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCompactMode(!compactMode)} className="glass-btn flex-1 text-xs">
                {compactMode ? "Switch to Cards (rich)" : "Switch to Compact (low-data)"}
              </button>
              <button onClick={refreshAlias} className="glass-btn text-xs">Rotate alias</button>
            </div>
            <CoreStrip />
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, active, icon, label }: { href: string; active: boolean; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-1.5 rounded-xl px-3 py-2 transition-all border border-transparent",
        active ? "glass text-white" : "text-slate-300 hover:text-white hover:bg-white/5"
      )}
    >
      {icon}
      <span className="max-w-[140px] truncate text-[13px] font-medium">{label}</span>
    </Link>
  );
}

function MobileLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="glass-soft rounded-xl px-3 py-2.5 text-[13px] text-slate-200 truncate">
      {label}
    </Link>
  );
}

function CoreStrip() {
  const { cores, activeCoreId, setActiveCoreId } = usePeople();
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
      <button
        onClick={() => setActiveCoreId(null)}
        className={cn("glass-soft shrink-0 rounded-full px-3 py-1.5 text-xs", !activeCoreId && "accent-glow text-white")}
      >
        All Cores
      </button>
      {cores.map((c) => (
        <button
          key={c.id}
          onClick={() => setActiveCoreId(activeCoreId === c.id ? null : c.id)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs glass-soft",
            activeCoreId === c.id && "accent-glow text-white"
          )}
        >
          <CoreIcon name={c.icon_name} size={13} />
          {c.name}
        </button>
      ))}
    </div>
  );
}
