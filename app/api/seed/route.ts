import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SEED_CORES } from "@/lib/people/seed";
import { createHash } from "crypto";

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json(
      { ok: false, reason: "supabase-not-configured", cores: SEED_CORES },
      { status: 200 }
    );
  }
  try {
    const sb = createClient(url, key);
    const { error } = await sb.from("cores").upsert(SEED_CORES, { onConflict: "id" });
    if (error) return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
    const hash = createHash("sha256").update("PEOPLE-05152005").digest("hex");
    await sb.from("admin_settings").upsert({ id: "global", master_passkey_hash: hash, authorized_roster: [] });
    return NextResponse.json({ ok: true, seeded: SEED_CORES.length });
  } catch (e) {
    return NextResponse.json({ ok: false, reason: e instanceof Error ? e.message : "unknown" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    usage: "POST /api/seed to upsert the 16 Cores + global admin settings into Supabase.",
    cores: SEED_CORES.length,
  });
}
