import { NextResponse } from "next/server";
import { getProductStore, productPersistenceMode } from "@/lib/product-store";
import { ensureSession, publicSession, saveSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  let session = await ensureSession();
  if (productPersistenceMode() === "supabase") {
    const databaseBalance = await getProductStore().getCreditBalance(session.id);
    if (databaseBalance !== null && databaseBalance !== session.credits) {
      session = { ...session, credits: databaseBalance };
      await saveSession(session);
    }
  }
  return NextResponse.json(publicSession(session));
}
