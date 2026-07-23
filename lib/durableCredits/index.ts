/**
 * Durable credits facade (T5 Phase C).
 *
 * Soft-launch still uses Cookie sessions for guest generate.
 * This module provides the durable reserve/settle/release engine + local file
 * adapter and SQL migration so production can switch without a rewrite.
 *
 * Production gate: REQUIRE_DURABLE_CREDITS=1 refuses to claim durable ready
 * without a writable store. Live Stripe still stays off until boss approval.
 */

export type { DurableState, CreditWallet, CreditReservation } from "./types";
export {
  emptyState,
  createPersonalAccount,
  grantCredits,
  reserveCredits,
  settleReservationItem,
  releaseReservationItem,
  migrateGuestCredits,
} from "./engine";
export {
  loadDurableState,
  saveDurableState,
  probeDurableCreditsStore,
} from "./localStore";

import {
  createPersonalAccount,
  grantCredits,
  migrateGuestCredits,
  releaseReservationItem,
  reserveCredits,
  settleReservationItem,
} from "./engine";
import { loadDurableState, saveDurableState } from "./localStore";
import type { DurableState, ReservationPurpose } from "./types";

async function withState<T>(
  fn: (state: DurableState) => {
    ok: boolean;
    state: DurableState;
    data?: T;
    code?: string;
    error?: string;
  }
): Promise<
  | { ok: true; data: T }
  | { ok: false; code: string; error: string }
> {
  const state = await loadDurableState();
  const result = fn(state);
  if (result.ok) {
    await saveDurableState(result.state);
    return { ok: true, data: result.data as T };
  }
  return {
    ok: false,
    code: result.code || "ERROR",
    error: result.error || "Durable credits error",
  };
}

/** Ensure a personal Free account + wallet exist for a durable user id. */
export async function ensurePersonalAccount(userId: string, initialAvailable = 10) {
  return withState((state) => {
    const existing = Object.values(state.accounts).find(
      (a) => a.ownerUserId === userId && a.kind === "personal"
    );
    if (existing) {
      return {
        ok: true,
        state,
        data: {
          account: existing,
          wallet: state.wallets[existing.id],
        },
      };
    }
    // Create empty wallet then grant so the free period is ledger-audited.
    const created = createPersonalAccount(state, {
      userId,
      planId: "free",
      initialAvailable: 0,
    });
    if (!created.ok) {
      return {
        ok: false,
        state: created.state,
        code: created.code,
        error: created.error,
      };
    }
    if (initialAvailable > 0) {
      const granted = grantCredits(created.state, {
        accountId: created.data.account.id,
        credits: initialAvailable,
        sourceType: "free_period",
        sourceId: `free:${created.data.account.id}:bootstrap`,
        idempotencyKey: `free:${created.data.account.id}:bootstrap`,
      });
      if (!granted.ok) {
        return {
          ok: false,
          state: granted.state,
          code: granted.code,
          error: granted.error,
        };
      }
      return {
        ok: true,
        state: granted.state,
        data: {
          account: granted.state.accounts[created.data.account.id],
          wallet: granted.data.wallet,
        },
      };
    }
    return {
      ok: true,
      state: created.state,
      data: created.data,
    };
  });
}

export async function durableReserve(input: {
  accountId: string;
  createdBy: string;
  purpose: ReservationPurpose;
  quotedCredits: number;
  idempotencyKey: string;
}) {
  return withState((state) => {
    const r = reserveCredits(state, input);
    if (!r.ok) {
      return { ok: false, state: r.state, code: r.code, error: r.error };
    }
    return { ok: true, state: r.state, data: r.data };
  });
}

export async function durableSettle(input: {
  reservationId: string;
  credits: number;
  idempotencyKey: string;
  jobId?: string;
}) {
  return withState((state) => {
    const r = settleReservationItem(state, input);
    if (!r.ok) {
      return { ok: false, state: r.state, code: r.code, error: r.error };
    }
    return { ok: true, state: r.state, data: r.data };
  });
}

export async function durableRelease(input: {
  reservationId: string;
  credits: number;
  idempotencyKey: string;
  reason?: string;
  jobId?: string;
}) {
  return withState((state) => {
    const r = releaseReservationItem(state, input);
    if (!r.ok) {
      return { ok: false, state: r.state, code: r.code, error: r.error };
    }
    return { ok: true, state: r.state, data: r.data };
  });
}

export async function durableMigrateGuest(input: {
  guestSessionIdHash: string;
  userId: string;
  accountId: string;
  cookieCredits: number;
  idempotencyKey: string;
}) {
  return withState((state) => {
    const r = migrateGuestCredits(state, input);
    if (!r.ok) {
      return { ok: false, state: r.state, code: r.code, error: r.error };
    }
    return { ok: true, state: r.state, data: r.data };
  });
}

/**
 * Shadow/audit ledger is on when explicitly enabled, or when Supabase Auth
 * is configured (signed-in claim path needs a wallet even before Postgres).
 * Cookie generate remains authoritative until REQUIRE_DURABLE_CREDITS=1.
 */
export function durableCreditsActive(): boolean {
  if (
    process.env.DURABLE_CREDITS === "local" ||
    process.env.DURABLE_CREDITS === "1" ||
    process.env.REQUIRE_DURABLE_CREDITS === "1"
  ) {
    return true;
  }
  // Auto-on when Supabase is present so claim + signed-in shadow work.
  const url = (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    ""
  ).trim();
  return url.startsWith("http");
}

/** Look up personal wallet for a durable user id (null if none). */
export async function getPersonalWallet(userId: string): Promise<{
  accountId: string;
  availableCredits: number;
  reservedCredits: number;
  planId: string;
} | null> {
  const state = await loadDurableState();
  const account = Object.values(state.accounts).find(
    (a) => a.ownerUserId === userId && a.kind === "personal"
  );
  if (!account) return null;
  const wallet = state.wallets[account.id];
  if (!wallet) return null;
  return {
    accountId: account.id,
    availableCredits: wallet.availableCredits,
    reservedCredits: wallet.reservedCredits,
    planId: account.planId,
  };
}
