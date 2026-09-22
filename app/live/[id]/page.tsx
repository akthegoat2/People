"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/people/navbar";
import { Sidebar } from "@/components/people/sidebar";
import { BottomNav } from "@/components/people/bottom-nav";
import { LiveRoom } from "@/components/people/live-room";
import { getSupabaseBrowser, isSupabaseConfigured, localStore } from "@/lib/people/supabase";
import type { LiveDiscussion } from "@/lib/people/types";

export default function LiveRoomPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);
  const [room, setRoom] = useState<LiveDiscussion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        const all = localStore.readLS<LiveDiscussion[]>(localStore.LS_LIVE, []);
        setRoom(all.find((r) => r.id === id) ?? null);
        setLoading(false);
        return;
      }
      try {
        const sb = getSupabaseBrowser()!;
        const { data } = await sb.from("live_discussions").select("*").eq("id", id).single();
        setRoom((data as LiveDiscussion) ?? null);
      } catch {
        setRoom(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <div className="min-h-screen pb-24 lg:pb-10">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pt-6">
        <Sidebar />
        <main className="min-w-0 flex-1 space-y-4">
          <Link href="/live" className="inline-flex items-center gap-1.5 text-[12.5px] text-slate-400 hover:text-white">
            <ArrowLeft size={14} /> All live rooms
          </Link>
          {loading ? (
            <div className="glass rounded-2xl p-8 animate-pulse text-[13px] text-slate-400">Connecting to room...</div>
          ) : !room ? (
            <div className="glass rounded-2xl p-10 text-center">
              <p className="font-bold text-white">Room not found or ended</p>
              <p className="mt-1 text-[13px] text-slate-400">It may be a local demo room on another device.</p>
              <Link href="/live" className="glass-btn mt-4 inline-block">Back to Live</Link>
            </div>
          ) : (
            <LiveRoom discussionId={room.id} title={room.title} about={room.about} creator={room.creator_alias} />
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
