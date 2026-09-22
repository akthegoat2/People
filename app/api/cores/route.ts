import { NextResponse } from "next/server";
import { SEED_CORES } from "@/lib/people/seed";

export async function GET() {
  return NextResponse.json({ cores: SEED_CORES, count: SEED_CORES.length });
}
