"use client";

import { RefreshCw, Radio } from "lucide-react";
import { usePeople } from "@/contexts/people-context";
import { useFeed } from "@/lib/people/feed-hook";
import { Composer } from "./composer";
import { PostCard } from "./post-card";

export function Feed({ coreId }: { coreId?: string | null }) {
  const { alias, activeCoreId, search, compactMode } = usePeople();
  const effectiveCore = coreId ?? activeCoreId;
  const { posts, loading, live, refresh, createPost, flame } = useFeed(effectiveCore, search);

  return (
    <div className="space-y-4">
      <Composer onPost={(cid, content) => createPost(cid, alias, content)} />

      <div className="flex items-center gap-2 text-[11px] text-slate-400">
        <span className={live ? "live-dot" : "h-2 w-2 rounded-full bg-slate-500"} />
        <span>{live ? "Realtime connected" : loading ? "Syncing..." : "Local mode — configure Supabase for realtime"}</span>
        <span className="ml-1">· {posts.length} transmissions</span>
        <button onClick={refresh} className="ml-auto flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 hover:border-white/25 text-slate-300">
          <RefreshCw size={11} /> Refresh
        </button>
      </div>

      {loading && posts.length === 0 ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass rounded-2xl p-5 animate-pulse">
              <div className="h-3 w-1/3 rounded bg-white/10" />
              <div className="mt-3 h-3 w-full rounded bg-white/5" />
              <div className="mt-2 h-3 w-2/3 rounded bg-white/5" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <Radio size={28} className="mx-auto text-slate-500" />
          <p className="mt-3 font-semibold text-slate-200">Silence in this frequency</p>
          <p className="mt-1 text-[13px] text-slate-400">Be the first voice — transmit above.</p>
        </div>
      ) : (
        <div className={compactMode ? "space-y-2" : "space-y-4"}>
          {posts.map((p) => (
            <PostCard key={p.id} post={p} compact={compactMode} onFlame={(id) => flame(id, alias)} />
          ))}
        </div>
      )}
    </div>
  );
}
