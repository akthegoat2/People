"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ScrollText } from "lucide-react";
import { Navbar } from "@/components/people/navbar";
import { Sidebar } from "@/components/people/sidebar";
import { BottomNav } from "@/components/people/bottom-nav";
import { Footer } from "@/components/people/footer";
import { Feed } from "@/components/people/feed";
import { LiveEngine } from "@/components/people/live-engine";
import { CoreIcon } from "@/components/people/core-icon";
import { usePeople } from "@/contexts/people-context";
import { useEffect } from "react";

export default function CorePage() {
  const params = useParams();
  const coreId = decodeURIComponent(params.coreId as string);
  const { cores, setActiveCoreId } = usePeople();
  const core = cores.find((c) => c.id === coreId);

  useEffect(() => {
    setActiveCoreId(coreId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coreId]);

  if (!core) {
    return (
      <div className="min-h-screen pb-24">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 pt-10">
          <div className="glass rounded-2xl p-10 text-center">
            <p className="font-bold text-white">Core not found</p>
            <Link href="/" className="glass-btn mt-4 inline-block">Return to Stream</Link>
          </div>
        </div>
      <Footer />
      <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-10">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pt-6">
        <Sidebar />
        <main className="min-w-0 flex-1 space-y-5">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[12.5px] text-slate-400 hover:text-white">
            <ArrowLeft size={14} /> All Cores
          </Link>
          <section className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0" style={{ background: `${core.gradient}33` }} />
            <div className="relative flex items-start gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 accent-glow" style={{ background: core.gradient }}>
                <CoreIcon name={core.icon_name} size={24} className="text-white" />
              </span>
              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">{core.name}</h1>
                <p className="mt-0.5 text-[13px] text-slate-300">{core.tagline}</p>
              </div>
            </div>
            <p className="relative mt-4 max-w-3xl text-[13.5px] leading-relaxed text-slate-200">{core.description}</p>
            <div className="relative mt-4 glass-soft rounded-2xl p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                <ScrollText size={13} /> Core rules
              </p>
              <ul className="mt-2 space-y-1.5">
                {core.rules.map((r, i) => (
                  <li key={i} className="text-[12.5px] text-slate-300">· {r}</li>
                ))}
              </ul>
            </div>
          </section>

          <LiveEngine coreId={core.id} />
          <Feed coreId={core.id} />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
