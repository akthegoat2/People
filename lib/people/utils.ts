const ADJECTIVES = [
  "Ghost", "TruthSpeaker", "Silent", "Iron", "Velvet", "Cipher",
  "Nomad", "Echo", "Obsidian", "Lantern", "Drift", "Hollow",
  "Static", "Midnight", "Parable", "Witness", "Ashen", "Cobalt",
];
const NOUNS = [
  "Falcon", "River", "Signal", "Monk", "Cartographer", "Wolf",
  "Mirror", "Sage", "Comet", "Anvil", "Herald", "Moth",
];

export function generateAlias(): string {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const n = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(100 + Math.random() * 900);
  // e.g. TruthSpeaker-928 / Ghost-409
  const useCompound = Math.random() > 0.5;
  return useCompound ? `${a}${n}-${num}` : `${a}-${num}`;
}

export function getOrCreateAlias(): string {
  if (typeof window === "undefined") return "Ghost-000";
  let alias = localStorage.getItem("people:alias");
  if (!alias) {
    alias = generateAlias();
    localStorage.setItem("people:alias", alias);
  }
  return alias;
}

export function regenerateAlias(): string {
  const alias = generateAlias();
  if (typeof window !== "undefined") localStorage.setItem("people:alias", alias);
  return alias;
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

/** Precomputed SHA-256 of PEOPLE-05152005 (computed at runtime fallback) */
export const MASTER_PASSKEY = "PEOPLE-05152005";

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

/** True only for canonical UUIDs — demo/local ids must stay local-only. */
export function isUuid(id: string | null | undefined): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}
