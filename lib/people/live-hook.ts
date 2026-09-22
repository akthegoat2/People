"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowser, isSupabaseConfigured, localStore } from "@/lib/people/supabase";
import { isUuid } from "@/lib/people/utils";
import type { LiveDiscussion, LiveMessage } from "@/lib/people/types";

const DEMO_ROOMS: LiveDiscussion[] = [
  {
    id: "demo-live-1",
    core_id: "politics-core",
    title: "Budget Autopsy: Where Do Taxes Actually Go?",
    about: "Line-by-line teardown of recurrent vs capital expenditure. Bring figures.",
    creator_alias: "Witness-204",
    active_participants: 47,
    is_active: true,
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "demo-live-2",
    core_id: "anime-core",
    title: "Sakuga Study Hall: One Cut, Frame by Frame",
    about: "Breaking down a 6-second action cut: timing charts, smears, and impact frames.",
    creator_alias: "DriftComet-512",
    active_participants: 23,
    is_active: true,
    created_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
  },
];

export function useLiveRooms(coreId?: string | null) {
  const [rooms, setRooms] = useState<LiveDiscussion[]>(DEMO_ROOMS);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured()) {
      const stored = localStore.readLS<LiveDiscussion[]>(localStore.LS_LIVE, DEMO_ROOMS);
      setRooms(coreId ? stored.filter((r) => r.core_id === coreId) : stored);
      setLoading(false);
      return;
    }
    try {
      const sb = getSupabaseBrowser()!;
      let q = sb.from("live_discussions").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(50);
      if (coreId) q = q.eq("core_id", coreId);
      const { data } = await q;
      if (data && data.length > 0) setRooms(data as LiveDiscussion[]);
    } catch {
      const stored = localStore.readLS<LiveDiscussion[]>(localStore.LS_LIVE, DEMO_ROOMS);
      setRooms(stored);
    } finally {
      setLoading(false);
    }
  }, [coreId]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const sb = getSupabaseBrowser();
    if (!sb) return;
    const ch = sb
      .channel("live-rooms")
      .on("postgres_changes", { event: "*", schema: "public", table: "live_discussions" }, () => fetchRooms())
      .subscribe();
    return () => {
      sb.removeChannel(ch);
    };
  }, [fetchRooms]);

  const createRoom = useCallback(
    async (input: { core_id: string; title: string; about: string; creator_alias: string }) => {
      const temp: LiveDiscussion = {
        id: `local-${Date.now()}`,
        ...input,
        active_participants: 1,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setRooms((prev) => {
        const next = [temp, ...prev];
        localStore.writeLS(localStore.LS_LIVE, next.slice(0, 100));
        return next;
      });
      if (!isSupabaseConfigured()) return { ok: true, room: temp, offline: true };
      const sb = getSupabaseBrowser()!;
      const { data, error } = await sb.from("live_discussions").insert(input).select("*").single();
      if (error) return { ok: false, reason: error.message };
      fetchRooms();
      return { ok: true, room: data as LiveDiscussion };
    },
    [fetchRooms]
  );

  return { rooms, loading, refresh: fetchRooms, createRoom };
}

export function useLiveMessages(discussionId: string) {
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMsgs = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured() || discussionId.startsWith("demo-") || discussionId.startsWith("local-")) {
      const all = localStore.readLS<LiveMessage[]>(localStore.LS_MSGS, []);
      setMessages(all.filter((m) => m.discussion_id === discussionId));
      setLoading(false);
      return;
    }
    try {
      const sb = getSupabaseBrowser()!;
      const { data } = await sb.from("live_messages").select("*").eq("discussion_id", discussionId).order("created_at", { ascending: true }).limit(200);
      setMessages((data as LiveMessage[]) ?? []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [discussionId]);

  useEffect(() => {
    fetchMsgs();
  }, [fetchMsgs]);

  useEffect(() => {
    if (!isSupabaseConfigured() || !isUuid(discussionId)) return;
    const sb = getSupabaseBrowser();
    if (!sb) return;
    const ch = sb
      .channel(`live-msgs-${discussionId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_messages", filter: `discussion_id=eq.${discussionId}` },
        (payload) => {
          const row = payload.new as LiveMessage;
          setMessages((prev) => (prev.some((m) => m.id === row.id) ? prev : [...prev, row]));
        }
      )
      .subscribe();
    return () => {
      sb.removeChannel(ch);
    };
  }, [discussionId]);

  const send = useCallback(
    async (sender_alias: string, text: string) => {
      const trimmed = text.trim().slice(0, 2000);
      if (!trimmed) return { ok: false };
      const temp: LiveMessage = {
        id: `local-${Date.now()}`,
        discussion_id: discussionId,
        sender_alias,
        text: trimmed,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, temp]);
      const all = localStore.readLS<LiveMessage[]>(localStore.LS_MSGS, []);
      localStore.writeLS(localStore.LS_MSGS, [...all, temp].slice(-500));
      if (!isSupabaseConfigured() || discussionId.startsWith("demo-") || discussionId.startsWith("local-"))
        return { ok: true, offline: true };
      try {
        const sb = getSupabaseBrowser()!;
        await sb.from("live_messages").insert({ discussion_id: discussionId, sender_alias, text: trimmed });
        return { ok: true };
      } catch {
        return { ok: false };
      }
    },
    [discussionId]
  );

  return { messages, loading, send, refresh: fetchMsgs };
}
