/**
 * Optional shadow ledger for soft-launch generate.
 * Cookie remains authoritative until Supabase auth is live.
 * Enable with DURABLE_CREDITS=local|1.
 *
 * Maps guest session id → personal account for reserve/settle/release audit.
 */

import {
  durableCreditsActive,
  durableRelease,
  durableReserve,
  durableSettle,
  ensurePersonalAccount,
} from "@/lib/durableCredits";
import { jobCostCredits } from "@/lib/contracts";

export type ShadowReservation = {
  accountId: string;
  reservationId: string;
  credits: number;
};

export async function shadowReserveForGuest(
  guestSessionId: string
): Promise<ShadowReservation | null> {
  if (!durableCreditsActive()) return null;
  try {
    const ensured = await ensurePersonalAccount(guestSessionId, 10);
    if (!ensured.ok) return null;
    const accountId = ensured.data.account.id;
    const credits = jobCostCredits();
    const key = `shadow-reserve:${guestSessionId}:${Date.now()}`;
    const reserved = await durableReserve({
      accountId,
      createdBy: guestSessionId,
      purpose: "generation",
      quotedCredits: credits,
      idempotencyKey: key,
    });
    if (!reserved.ok) {
      // Shadow must never block live cookie path — log and continue.
      console.warn("[durable-shadow] reserve failed", reserved.code, reserved.error);
      return null;
    }
    return {
      accountId,
      reservationId: reserved.data.reservation.id,
      credits,
    };
  } catch (e) {
    console.warn("[durable-shadow] reserve error", e);
    return null;
  }
}

export async function shadowSettle(
  shadow: ShadowReservation | null,
  jobId?: string
): Promise<void> {
  if (!shadow) return;
  try {
    await durableSettle({
      reservationId: shadow.reservationId,
      credits: shadow.credits,
      idempotencyKey: `shadow-settle:${shadow.reservationId}:${jobId || "ok"}`,
      jobId,
    });
  } catch (e) {
    console.warn("[durable-shadow] settle error", e);
  }
}

export async function shadowRelease(
  shadow: ShadowReservation | null,
  reason: string,
  jobId?: string
): Promise<void> {
  if (!shadow) return;
  try {
    await durableRelease({
      reservationId: shadow.reservationId,
      credits: shadow.credits,
      idempotencyKey: `shadow-release:${shadow.reservationId}:${reason}`,
      reason,
      jobId,
    });
  } catch (e) {
    console.warn("[durable-shadow] release error", e);
  }
}
