"use client";

import { Navbar } from "@/components/people/navbar";
import { Sidebar } from "@/components/people/sidebar";
import { BottomNav } from "@/components/people/bottom-nav";
import { Feed } from "@/components/people/feed";
import { CoreIcon } from "@/components/people/core-icon";
import { usePeople } from "@/contexts/people-context";
import Link from "next/link";
import { Flame, Radio, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const { cores, activeCoreId, setActiveCoreId, alias } = usePeople();

  return (
    <div className="min-h-screen pb-24 lg:pb-10">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pt-6">
        <Sidebar />
        <main className="min-w-0 flex-1">
          {/* Hero */}
          <section className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(600px 220px at 20% 0%, rgba(139,151,173,0.25), transparent 60%)" }}
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Open speech · Pseudonymous · Realtime
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient-steel">
              People
            </h1>
            <p className="text-[13px] text-slate-400">for the people, by the people</p>
            <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-slate-300">
              Sixteen specialized Cores for fearless discourse — politics to philosophy, anime to
              egalitarian futures. Transmit as <span className="font-semibold text-white">{alias}</span>,
              earn flames, open live rooms, and never surrender your identity.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/live" className="glass-btn-primary glass-btn flex items-center gap-1.5 text-[13px]">
                <Radio size={14} /> Enter Live
              </Link>
              <Link href="/admin" className="glass-btn flex items-center gap-1.5 text-[13px]">
                <ShieldCheck size={14} /> Admin Console
              </Link>
            </div>
          </section>

          {/* Core grid */}
          <section className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <Flame size={15} className="text-slate-300" />
              <h2 className="text-[14px] font-bold text-white">Explore the 16 Cores</h2>
              {activeCoreId && (
                <button onClick={() => setActiveCoreId(null)} className="ml-auto text-[12px] underline underline-offset-4 text-slate-300">
                  Show all
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
              {cores.map((c) => {
                const active = activeCoreId === c.id;
                return (
                  <Link
                    key={c.id}
                    href={`/c/${c.id}`}
                    onClick={() => setActiveCoreId(c.id)}
                    className={`glass rounded-2xl p-3.5 transition-all hover:border-white/[0.18] hover:-translate-y-0.5 ${active ? "accent-glow border-white/20" : ""}`}
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10" style={{ background: c.gradient }}>
                      <CoreIcon name={c.icon_name} size={17} className="text-white" />
                    </span>
                    <span className="mt-2.5 block text-[13px] font-bold text-white leading-tight">{c.name}</span>
                    <span className="mt-0.5 line-clamp-2 block text-[11.5px] text-slate-400 leading-snug">{c.tagline}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Stream */}
          <section className="mt-6">
            <h2 className="mb-3 text-[14px] font-bold text-white">
              {activeCoreId ? cores.find((c) => c.id === activeCoreId)?.name : "Global Stream"}
            </h2>
            <Feed />
          </section>
        </main>

        {/* Right rail */}
        <aside className="hidden xl:block w-[280px] shrink-0">
          <div className="sticky top-[76px] space-y-4">
            <div className="glass rounded-2xl p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Live now</p>
              <Link href="/live" className="mt-2 flex items-center gap-2 text-[13px] text-slate-200 hover:text-white">
                <span className="live-dot" /> 2 rooms transmitting
              </Link>
              <Link href="/live" className="glass-btn mt-3 block text-center text-[12.5px]">Browse rooms</Link>
            </div>
            <div className="glass-soft rounded-2xl p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">House rules</p>
              <ul className="mt-2 space-y-1.5 text-[12px] leading-relaxed text-slate-300">
                <li>· Pseudonyms are sacred — never doxx.</li>
                <li>· Attack arguments, not people.</li>
                <li>· Cite sources for factual claims.</li>
                <li>· Flames reward insight, not outrage.</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
      <BottomNav />
    </div>
  );
}
