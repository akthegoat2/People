"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser, isSupabaseConfigured, localStore } from "@/lib/people/supabase";
import { isUuid } from "@/lib/people/utils";
import { createPostAction, ensureSeeded, flamePostAction } from "@/lib/people/actions";
import type { CommentRow, Post } from "@/lib/people/types";

const DEMO_POSTS: Post[] = [
  {
    id: "demo-1",
    core_id: "renaissance-core",
    author_alias: "TruthSpeaker-928",
    content:
      "A national grid that fails 12 times a year is not a technical problem — it is a contracting problem. Publish every transmission contract, penalty clause, and maintenance log. Transparency is the cheapest megawatt.",
    flames_count: 214,
    is_pinned: true,
    created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: "demo-2",
    core_id: "philosophy-core",
    author_alias: "Ghost-409",
    content:
      "Stoicism is often misread as suppression. The actual claim is narrower: distinguish what is up to you (judgment, intent, response) from what is not (reputation, outcome, fortune) — then act fully where agency exists.",
    flames_count: 96,
    is_pinned: false,
    created_at: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
  },
  {
    id: "demo-3",
    core_id: "critical-thinking-core",
    author_alias: "CipherMoth-311",
    content:
      "Before sharing that viral chart: check axes, check denominators, check dates. A bar chart without a labeled y-axis is a mood, not evidence.",
    flames_count: 158,
    is_pinned: false,
    created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
];

export function useFeed(coreId: string | null, search: string) {
  const [posts, setPosts] = useState<Post[]>(DEMO_POSTS);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured()) {
      const stored = localStore.readLS<Post[]>(localStore.LS_POSTS, DEMO_POSTS);
      setPosts(stored);
      setLoading(false);
      return;
    }
    try {
      await ensureSeeded();
      const sb = getSupabaseBrowser()!;
      let q = sb.from("posts").select("*").order("created_at", { ascending: false }).limit(100);
      if (coreId) q = q.eq("core_id", coreId);
      const { data } = await q;
      if (data && data.length > 0) setPosts(data as Post[]);
      else {
        const stored = localStore.readLS<Post[]>(localStore.LS_POSTS, DEMO_POSTS);
        setPosts(coreId ? stored.filter((p) => p.core_id === coreId) : stored);
      }
      setLive(true);
    } catch {
      const stored = localStore.readLS<Post[]>(localStore.LS_POSTS, DEMO_POSTS);
      setPosts(coreId ? stored.filter((p) => p.core_id === coreId) : stored);
      setLive(false);
    } finally {
      setLoading(false);
    }
  }, [coreId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Realtime subscription for new posts
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const sb = getSupabaseBrowser();
    if (!sb) return;
    const channel = sb
      .channel("people-posts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
        const row = payload.new as Post;
        if (coreId && row.core_id !== coreId) return;
        setPosts((prev) => (prev.some((p) => p.id === row.id) ? prev : [row, ...prev]));
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "posts" }, (payload) => {
        const row = payload.new as Post;
        setPosts((prev) => prev.map((p) => (p.id === row.id ? row : p)));
      })
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  }, [coreId]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const sorted = [...posts].sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      return +new Date(b.created_at) - +new Date(a.created_at);
    });
    if (!s) return sorted;
    return sorted.filter(
      (p) =>
        p.content.toLowerCase().includes(s) ||
        p.author_alias.toLowerCase().includes(s)
    );
  }, [posts, search]);

  const createPost = useCallback(
    async (core_id: string, author_alias: string, content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return { ok: false };
      // optimistic local
      const temp: Post = {
        id: `local-${Date.now()}`,
        core_id,
        author_alias,
        content: trimmed.slice(0, 5000),
        flames_count: 0,
        is_pinned: false,
        created_at: new Date().toISOString(),
      };
      setPosts((prev) => {
        const next = [temp, ...prev];
        localStore.writeLS(localStore.LS_POSTS, next.slice(0, 200));
        return next;
      });
      if (!isSupabaseConfigured()) return { ok: true, offline: true };
      const res = await createPostAction({ core_id, author_alias, content: trimmed });
      if (res.ok) fetchPosts();
      return res;
    },
    [fetchPosts]
  );

  const flame = useCallback(async (postId: string, voterAlias: string) => {
    // local flame guard
    try {
      const key = `people:flamed:${postId}`;
      if (localStorage.getItem(key)) return { ok: false, reason: "already-flamed" };
      localStorage.setItem(key, "1");
    } catch {}
    setPosts((prev) => {
      const next = prev.map((p) => (p.id === postId ? { ...p, flames_count: p.flames_count + 1 } : p));
      localStore.writeLS(localStore.LS_POSTS, next.slice(0, 200));
      return next;
    });
    if (!isSupabaseConfigured()) return { ok: true, offline: true };
    if (!isUuid(postId)) return { ok: true, offline: true };
    const res = await flamePostAction(postId, voterAlias);
    if (!res.ok && res.reason !== "already-flamed") {
      // rollback
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, flames_count: Math.max(0, p.flames_count - 1) } : p)));
    }
    return res;
  }, []);

  return { posts: filtered, loading, live, refresh: fetchPosts, createPost, flame };
}

export function useComments(postId: string | null) {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!postId) {
      setComments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    if (!isSupabaseConfigured() || !isUuid(postId)) {
      const all = localStore.readLS<CommentRow[]>(localStore.LS_COMMENTS, []);
      setComments(all.filter((c) => c.post_id === postId));
      setLoading(false);
      return;
    }
    try {
      const sb = getSupabaseBrowser()!;
      const { data } = await sb.from("comments").select("*").eq("post_id", postId).order("created_at", { ascending: true });
      setComments((data as CommentRow[]) ?? []);
    } catch {
      const all = localStore.readLS<CommentRow[]>(localStore.LS_COMMENTS, []);
      setComments(all.filter((c) => c.post_id === postId));
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    if (!postId || !isSupabaseConfigured() || !isUuid(postId)) return;
    const sb = getSupabaseBrowser();
    if (!sb) return;
    const channel = sb
      .channel(`comments-${postId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `post_id=eq.${postId}` },
        (payload) => {
          const row = payload.new as CommentRow;
          setComments((prev) => (prev.some((c) => c.id === row.id) ? prev : [...prev, row]));
        }
      )
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  }, [postId]);

  const addComment = useCallback(
    async (author_alias: string, content: string) => {
      if (!postId) return { ok: false };
      const trimmed = content.trim().slice(0, 2000);
      if (!trimmed) return { ok: false };
      const temp: CommentRow = {
        id: `local-${Date.now()}`,
        post_id: postId,
        author_alias,
        content: trimmed,
        created_at: new Date().toISOString(),
      };
      setComments((prev) => {
        const all = localStore.readLS<CommentRow[]>(localStore.LS_COMMENTS, []);
        localStore.writeLS(localStore.LS_COMMENTS, [...all, temp].slice(-500));
        return [...prev, temp];
      });
      if (!isSupabaseConfigured() || !isUuid(postId)) return { ok: true, offline: true };
      try {
        const sb = getSupabaseBrowser()!;
        const { data, error } = await sb
          .from("comments")
          .insert({ post_id: postId, author_alias, content: trimmed })
          .select("*")
          .single();
        if (error) return { ok: false, reason: error.message };
        setComments((prev) => [...prev.filter((c) => c.id !== temp.id), data as CommentRow]);
        return { ok: true };
      } catch (e) {
        return { ok: false };
      }
    },
    [postId]
  );

  return { comments, loading, addComment, refresh: fetchComments };
}
