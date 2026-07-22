import { getPlan } from "@/lib/pricing";
import { jobCostCredits } from "@/lib/contracts";
import type { UserSession } from "@/lib/session";

export type CreditCheck =
  | { ok: true; cost: number; remainingAfter: number }
  | { ok: false; reason: "insufficient"; need: number; have: number };

export function checkCredits(session: UserSession): CreditCheck {
  const cost = jobCostCredits();
  if (session.credits < cost) {
    return {
      ok: false,
      reason: "insufficient",
      need: cost,
      have: session.credits,
    };
  }
  return {
    ok: true,
    cost,
    remainingAfter: session.credits - cost,
  };
}

export function deductCredits(
  session: UserSession,
  amount = jobCostCredits()
): UserSession {
  return {
    ...session,
    credits: Math.max(0, session.credits - amount),
  };
}

export function refundCredits(
  session: UserSession,
  amount = jobCostCredits()
): UserSession {
  const cap = getPlan(session.plan).credits;
  // Allow temporary over-cap on refund after failed gen (don't punish failed runs)
  return {
    ...session,
    credits: Math.min(cap * 2, session.credits + amount),
  };
}
