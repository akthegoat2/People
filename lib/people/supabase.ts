import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SEED_CORES } from "./seed";

let browser: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!browser) browser = createBrowserClient(url, key);
  return browser;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Local fallback store keys */
const LS_CORES = "people:cores:v1";
const LS_POSTS = "people:posts:v1";
const LS_COMMENTS = "people:comments:v1";
const LS_LIVE = "people:live:v1";
const LS_MSGS = "people:live_msgs:v1";

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLS(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / privacy mode */
  }
}

export function getLocalCores() {
  const stored = readLS(LS_CORES, null as unknown);
  if (stored) return stored;
  writeLS(LS_CORES, SEED_CORES);
  return SEED_CORES;
}

export function setLocalCores(cores: unknown) {
  writeLS(LS_CORES, cores);
}

export const localStore = { readLS, writeLS, LS_POSTS, LS_COMMENTS, LS_LIVE, LS_MSGS };
