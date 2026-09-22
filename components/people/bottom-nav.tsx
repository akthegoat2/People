"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Radio, ShieldCheck, User } from "lucide-react";
import { usePeople } from "@/contexts/people-context";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { alias } = usePeople();
  const items = [
    { href: "/", label: "Stream", icon: Flame, active: pathname === "/" },
    { href: "/live", label: "Live", icon: Radio, active: pathname?.startsWith("/live") ?? false },
    { href: `/u/${encodeURIComponent(alias)}`, label: "You", icon: User, active: pathname?.startsWith("/u/") ?? false },
    { href: "/admin", label: "Admin", icon: ShieldCheck, active: pathname === "/admin" },
  ];
  return (
    <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40">
      <div className="glass rounded-2xl px-2 py-2 flex items-center justify-around accent-glow">
        {items.map((it) => (
          <Link
            key={it.label}
            href={it.href}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-[10px] font-medium transition-all",
              it.active ? "text-white bg-white/10" : "text-slate-400"
            )}
          >
            <it.icon size={18} />
            {it.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
