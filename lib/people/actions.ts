"use server";

import { createClient } from "@supabase/supabase-js";

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/** Ensure seed cores + admin row exist. Idempotent. */
export async function ensureSeeded(): Promise<{ ok: boolean; reason?: string }> {
  const sb = serverClient();
  if (!sb) return { ok: false, reason: "supabase-not-configured" };
  try {
    const { data: existing } = await sb.from("cores").select("id").limit(1);
    if (!existing || existing.length === 0) {
      const { SEED_CORES } = await import("@/lib/people/seed");
      const { error } = await sb.from("cores").upsert(SEED_CORES, { onConflict: "id" });
      if (error) return { ok: false, reason: error.message };
    }
    const { data: admin } = await sb.from("admin_settings").select("id").eq("id", "global").maybeSingle();
    if (!admin) {
      // SHA-256 of PEOPLE-05152005
      const { createHash } = await import("crypto");
      const hash = createHash("sha256").update("PEOPLE-05152005").digest("hex");
      await sb.from("admin_settings").upsert({
        id: "global",
        master_passkey_hash: hash,
        authorized_roster: [],
      });
    }
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, reason: e instanceof Error ? e.message : "unknown" };
  }
}

export async function createPostAction(input: {
  core_id: string;
  author_alias: string;
  content: string;
}) {
  const sb = serverClient();
  if (!sb) return { ok: false, reason: "supabase-not-configured" };
  const content = input.content.trim().slice(0, 5000);
  if (!content || !input.core_id || !input.author_alias)
    return { ok: false, reason: "invalid-input" };
  const { data, error } = await sb
    .from("posts")
    .insert({ core_id: input.core_id, author_alias: input.author_alias, content })
    .select("*")
    .single();
  if (error) return { ok: false, reason: error.message };
  return { ok: true, post: data };
}

export async function flamePostAction(postId: string, voterAlias: string) {
  const sb = serverClient();
  if (!sb) return { ok: false, reason: "supabase-not-configured" };
  // guard double-vote
  const { data: existing } = await sb
    .from("flames")
    .select("post_id")
    .eq("post_id", postId)
    .eq("voter_alias", voterAlias)
    .maybeSingle();
  if (existing) return { ok: false, reason: "already-flamed" };
  await sb.from("flames").insert({ post_id: postId, voter_alias: voterAlias });
  const { data: post } = await sb.from("posts").select("flames_count").eq("id", postId).single();
  const next = (post?.flames_count ?? 0) + 1;
  await sb.from("posts").update({ flames_count: next }).eq("id", postId);
  return { ok: true, flames_count: next };
}
