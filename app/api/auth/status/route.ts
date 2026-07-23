import { NextResponse } from "next/server";
import { publicAuthStatus } from "@/lib/authConfig";
import { probeDurableCreditsStore } from "@/lib/durableCredits";

export const runtime = "nodejs";

/** Public auth readiness — no secrets. */
export async function GET() {
  const auth = publicAuthStatus();
  const durable = await probeDurableCreditsStore();
  return NextResponse.json({
    auth,
    durableCredits: {
      backend: durable.backend,
      writable: durable.writable,
      configured: durable.configured,
    },
  });
}
