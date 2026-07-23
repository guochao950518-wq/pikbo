/**
 * Pure durable credit engine — reserve / settle / release.
 * No I/O. engine-smoke re-implements critical cases against this contract.
 */

import { randomUUID } from "crypto";
import type {
  CreditReservation,
  CreditWallet,
  DurableAccount,
  DurableState,
  EngineResult,
  LedgerEntry,
  LedgerKind,
  PlanId,
  ReservationPurpose,
} from "@/lib/durableCredits/types";

export function emptyState(): DurableState {
  return {
    accounts: {},
    wallets: {},
    reservations: {},
    ledger: [],
    ledgerByIdempotency: {},
    reservationByIdempotency: {},
    consumedGuests: {},
  };
}

function nowIso(): string {
  return new Date().toISOString();
}

function cloneState(state: DurableState): DurableState {
  return {
    accounts: { ...state.accounts },
    wallets: { ...state.wallets },
    reservations: { ...state.reservations },
    ledger: [...state.ledger],
    ledgerByIdempotency: { ...state.ledgerByIdempotency },
    reservationByIdempotency: { ...state.reservationByIdempotency },
    consumedGuests: { ...state.consumedGuests },
  };
}

function appendLedger(
  state: DurableState,
  entry: Omit<LedgerEntry, "id" | "createdAt">
): { state: DurableState; entry: LedgerEntry } {
  const existingId = state.ledgerByIdempotency[entry.idempotencyKey];
  if (existingId) {
    const prev = state.ledger.find((l) => l.id === existingId);
    if (prev) return { state, entry: prev };
  }
  const full: LedgerEntry = {
    ...entry,
    id: randomUUID(),
    createdAt: nowIso(),
  };
  const next = cloneState(state);
  next.ledger = [full, ...next.ledger];
  next.ledgerByIdempotency[entry.idempotencyKey] = full.id;
  return { state: next, entry: full };
}

function mutateWallet(
  state: DurableState,
  accountId: string,
  deltaAvailable: number,
  deltaReserved: number,
  lifetimeDelta = 0
): { state: DurableState; wallet: CreditWallet } | null {
  const wallet = state.wallets[accountId];
  if (!wallet) return null;
  const available = wallet.availableCredits + deltaAvailable;
  const reserved = wallet.reservedCredits + deltaReserved;
  if (available < 0 || reserved < 0) return null;
  const nextWallet: CreditWallet = {
    ...wallet,
    availableCredits: available,
    reservedCredits: reserved,
    lifetimeUsedCredits: wallet.lifetimeUsedCredits + lifetimeDelta,
    version: wallet.version + 1,
    updatedAt: nowIso(),
  };
  const next = cloneState(state);
  next.wallets[accountId] = nextWallet;
  return { state: next, wallet: nextWallet };
}

export function createPersonalAccount(
  state: DurableState,
  input: {
    userId: string;
    planId?: PlanId;
    initialAvailable?: number;
    accountId?: string;
  }
): EngineResult<{ account: DurableAccount; wallet: CreditWallet }> {
  const accountId = input.accountId ?? randomUUID();
  if (state.accounts[accountId]) {
    return {
      ok: false,
      code: "DUPLICATE_OK",
      error: "Account already exists",
      state,
    };
  }
  const ts = nowIso();
  const account: DurableAccount = {
    id: accountId,
    kind: "personal",
    ownerUserId: input.userId,
    planId: input.planId ?? "free",
    status: "active",
    createdAt: ts,
    updatedAt: ts,
  };
  const wallet: CreditWallet = {
    accountId,
    availableCredits: Math.max(0, input.initialAvailable ?? 0),
    reservedCredits: 0,
    lifetimeUsedCredits: 0,
    version: 0,
    updatedAt: ts,
  };
  const next = cloneState(state);
  next.accounts[accountId] = account;
  next.wallets[accountId] = wallet;
  return { ok: true, data: { account, wallet }, state: next };
}

export function grantCredits(
  state: DurableState,
  input: {
    accountId: string;
    credits: number;
    sourceType: string;
    sourceId: string;
    idempotencyKey: string;
  }
): EngineResult<{ wallet: CreditWallet; ledger: LedgerEntry }> {
  if (input.credits <= 0) {
    return {
      ok: false,
      code: "INVALID_AMOUNT",
      error: "Grant must be positive",
      state,
    };
  }
  if (state.ledgerByIdempotency[input.idempotencyKey]) {
    const id = state.ledgerByIdempotency[input.idempotencyKey];
    const ledger = state.ledger.find((l) => l.id === id)!;
    return {
      ok: true,
      data: { wallet: state.wallets[input.accountId], ledger },
      state,
    };
  }
  const mutated = mutateWallet(state, input.accountId, input.credits, 0);
  if (!mutated) {
    return {
      ok: false,
      code: "WALLET_NOT_FOUND",
      error: "Wallet not found",
      state,
    };
  }
  const led = appendLedger(mutated.state, {
    accountId: input.accountId,
    kind: "grant",
    deltaAvailable: input.credits,
    deltaReserved: 0,
    availableAfter: mutated.wallet.availableCredits,
    reservedAfter: mutated.wallet.reservedCredits,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    idempotencyKey: input.idempotencyKey,
    metadata: {},
  });
  return {
    ok: true,
    data: { wallet: mutated.wallet, ledger: led.entry },
    state: led.state,
  };
}

export function reserveCredits(
  state: DurableState,
  input: {
    accountId: string;
    createdBy: string;
    purpose: ReservationPurpose;
    quotedCredits: number;
    idempotencyKey: string;
    /** ms from now; default 15 minutes */
    ttlMs?: number;
  }
): EngineResult<{ reservation: CreditReservation; wallet: CreditWallet }> {
  const existingId = state.reservationByIdempotency[input.idempotencyKey];
  if (existingId) {
    const reservation = state.reservations[existingId];
    const wallet = state.wallets[input.accountId];
    if (reservation && wallet) {
      return { ok: true, data: { reservation, wallet }, state };
    }
  }
  if (input.quotedCredits <= 0) {
    return {
      ok: false,
      code: "INVALID_AMOUNT",
      error: "Quote must be positive",
      state,
    };
  }
  if (!state.accounts[input.accountId]) {
    return {
      ok: false,
      code: "ACCOUNT_NOT_FOUND",
      error: "Account not found",
      state,
    };
  }
  const wallet = state.wallets[input.accountId];
  if (!wallet) {
    return {
      ok: false,
      code: "WALLET_NOT_FOUND",
      error: "Wallet not found",
      state,
    };
  }
  if (wallet.availableCredits < input.quotedCredits) {
    return {
      ok: false,
      code: "INSUFFICIENT_CREDITS",
      error: `Need ${input.quotedCredits}, have ${wallet.availableCredits}`,
      state,
    };
  }

  const mutated = mutateWallet(
    state,
    input.accountId,
    -input.quotedCredits,
    input.quotedCredits
  );
  if (!mutated) {
    return {
      ok: false,
      code: "INSUFFICIENT_CREDITS",
      error: "Wallet mutation rejected",
      state,
    };
  }

  const ts = nowIso();
  const reservation: CreditReservation = {
    id: randomUUID(),
    accountId: input.accountId,
    purpose: input.purpose,
    quotedCredits: input.quotedCredits,
    settledCredits: 0,
    releasedCredits: 0,
    status: "reserved",
    idempotencyKey: input.idempotencyKey,
    expiresAt: new Date(Date.now() + (input.ttlMs ?? 15 * 60_000)).toISOString(),
    createdBy: input.createdBy,
    createdAt: ts,
    updatedAt: ts,
  };

  const next = cloneState(mutated.state);
  next.reservations[reservation.id] = reservation;
  next.reservationByIdempotency[input.idempotencyKey] = reservation.id;

  const led = appendLedger(next, {
    accountId: input.accountId,
    kind: "reserve",
    deltaAvailable: -input.quotedCredits,
    deltaReserved: input.quotedCredits,
    availableAfter: mutated.wallet.availableCredits,
    reservedAfter: mutated.wallet.reservedCredits,
    reservationId: reservation.id,
    sourceType: input.purpose,
    sourceId: reservation.id,
    idempotencyKey: `reserve:${input.idempotencyKey}`,
    metadata: { quoted: input.quotedCredits },
  });

  return {
    ok: true,
    data: {
      reservation: led.state.reservations[reservation.id],
      wallet: led.state.wallets[input.accountId],
    },
    state: led.state,
  };
}

function remainingOnReservation(r: CreditReservation): number {
  return r.quotedCredits - r.settledCredits - r.releasedCredits;
}

function finalizeStatus(r: CreditReservation): CreditReservation["status"] {
  const rem = remainingOnReservation(r);
  if (rem === 0) {
    if (r.releasedCredits === r.quotedCredits) return "released";
    if (r.settledCredits === r.quotedCredits) return "settled";
    return "partially_settled";
  }
  if (r.settledCredits > 0 || r.releasedCredits > 0) return "partially_settled";
  return "reserved";
}

export function settleReservationItem(
  state: DurableState,
  input: {
    reservationId: string;
    credits: number;
    idempotencyKey: string;
    jobId?: string;
  }
): EngineResult<{ reservation: CreditReservation; wallet: CreditWallet }> {
  if (state.ledgerByIdempotency[input.idempotencyKey]) {
    const res = state.reservations[input.reservationId];
    const wallet = res ? state.wallets[res.accountId] : undefined;
    if (res && wallet) {
      return { ok: true, data: { reservation: res, wallet }, state };
    }
  }
  if (input.credits <= 0) {
    return {
      ok: false,
      code: "INVALID_AMOUNT",
      error: "Settle amount must be positive",
      state,
    };
  }
  const reservation = state.reservations[input.reservationId];
  if (!reservation) {
    return {
      ok: false,
      code: "RESERVATION_NOT_FOUND",
      error: "Reservation not found",
      state,
    };
  }
  if (new Date(reservation.expiresAt).getTime() < Date.now() && remainingOnReservation(reservation) === reservation.quotedCredits) {
    // fully unused + expired
    return {
      ok: false,
      code: "EXPIRED_RESERVATION",
      error: "Reservation expired",
      state,
    };
  }
  if (input.credits > remainingOnReservation(reservation)) {
    return {
      ok: false,
      code: "OVER_SETTLE",
      error: "Settle exceeds remaining reservation",
      state,
    };
  }

  const mutated = mutateWallet(
    state,
    reservation.accountId,
    0,
    -input.credits,
    input.credits
  );
  if (!mutated) {
    return {
      ok: false,
      code: "WALLET_NOT_FOUND",
      error: "Wallet mutation rejected",
      state,
    };
  }

  const updated: CreditReservation = {
    ...reservation,
    settledCredits: reservation.settledCredits + input.credits,
    updatedAt: nowIso(),
    status: "reserved",
  };
  updated.status = finalizeStatus(updated);

  const next = cloneState(mutated.state);
  next.reservations[updated.id] = updated;

  const led = appendLedger(next, {
    accountId: reservation.accountId,
    kind: "settle" as LedgerKind,
    deltaAvailable: 0,
    deltaReserved: -input.credits,
    availableAfter: mutated.wallet.availableCredits,
    reservedAfter: mutated.wallet.reservedCredits,
    reservationId: reservation.id,
    sourceType: "generation",
    sourceId: input.jobId ?? reservation.id,
    idempotencyKey: input.idempotencyKey,
    metadata: { settled: input.credits },
  });

  return {
    ok: true,
    data: {
      reservation: led.state.reservations[updated.id],
      wallet: led.state.wallets[reservation.accountId],
    },
    state: led.state,
  };
}

export function releaseReservationItem(
  state: DurableState,
  input: {
    reservationId: string;
    credits: number;
    idempotencyKey: string;
    reason?: string;
    jobId?: string;
  }
): EngineResult<{ reservation: CreditReservation; wallet: CreditWallet }> {
  if (state.ledgerByIdempotency[input.idempotencyKey]) {
    const res = state.reservations[input.reservationId];
    const wallet = res ? state.wallets[res.accountId] : undefined;
    if (res && wallet) {
      return { ok: true, data: { reservation: res, wallet }, state };
    }
  }
  if (input.credits <= 0) {
    return {
      ok: false,
      code: "INVALID_AMOUNT",
      error: "Release amount must be positive",
      state,
    };
  }
  const reservation = state.reservations[input.reservationId];
  if (!reservation) {
    return {
      ok: false,
      code: "RESERVATION_NOT_FOUND",
      error: "Reservation not found",
      state,
    };
  }
  if (input.credits > remainingOnReservation(reservation)) {
    return {
      ok: false,
      code: "OVER_SETTLE",
      error: "Release exceeds remaining reservation",
      state,
    };
  }

  // reserved → available
  const mutated = mutateWallet(
    state,
    reservation.accountId,
    input.credits,
    -input.credits
  );
  if (!mutated) {
    return {
      ok: false,
      code: "WALLET_NOT_FOUND",
      error: "Wallet mutation rejected",
      state,
    };
  }

  const updated: CreditReservation = {
    ...reservation,
    releasedCredits: reservation.releasedCredits + input.credits,
    updatedAt: nowIso(),
    status: "reserved",
  };
  updated.status = finalizeStatus(updated);

  const next = cloneState(mutated.state);
  next.reservations[updated.id] = updated;

  const led = appendLedger(next, {
    accountId: reservation.accountId,
    kind: "release",
    deltaAvailable: input.credits,
    deltaReserved: -input.credits,
    availableAfter: mutated.wallet.availableCredits,
    reservedAfter: mutated.wallet.reservedCredits,
    reservationId: reservation.id,
    sourceType: "generation",
    sourceId: input.jobId ?? reservation.id,
    idempotencyKey: input.idempotencyKey,
    metadata: { released: input.credits, reason: input.reason ?? null },
  });

  return {
    ok: true,
    data: {
      reservation: led.state.reservations[updated.id],
      wallet: led.state.wallets[reservation.accountId],
    },
    state: led.state,
  };
}

/**
 * Phase C — release remaining hold on expired reservations.
 * Returns credits to available; marks reservation status `expired`.
 * Idempotent via release idempotency key `expire:{reservationId}`.
 */
export function expireStaleReservations(
  state: DurableState,
  nowMs = Date.now()
): EngineResult<{ expired: number; releasedCredits: number }> {
  let next = state;
  let expired = 0;
  let releasedCredits = 0;
  for (const r of Object.values(state.reservations)) {
    const rem = remainingOnReservation(r);
    if (rem <= 0) continue;
    const exp = Date.parse(r.expiresAt);
    if (!Number.isFinite(exp) || exp > nowMs) continue;
    const result = releaseReservationItem(next, {
      reservationId: r.id,
      credits: rem,
      idempotencyKey: `expire:${r.id}`,
      reason: "expired",
    });
    if (!result.ok) continue;
    next = result.state;
    const res = next.reservations[r.id];
    if (res) {
      next = cloneState(next);
      next.reservations[r.id] = { ...res, status: "expired", updatedAt: nowIso() };
    }
    expired += 1;
    releasedCredits += rem;
  }
  return {
    ok: true,
    data: { expired, releasedCredits },
    state: next,
  };
}

/**
 * One-time guest Cookie balance → durable Free account.
 * Caps at 10; never migrates paid plan.
 */
export function migrateGuestCredits(
  state: DurableState,
  input: {
    guestSessionIdHash: string;
    userId: string;
    accountId: string;
    cookieCredits: number;
    idempotencyKey: string;
  }
): EngineResult<{ migrated: number; wallet: CreditWallet }> {
  if (state.consumedGuests[input.guestSessionIdHash]) {
    const wallet = state.wallets[input.accountId];
    return {
      ok: true,
      data: { migrated: 0, wallet },
      state,
    };
  }
  if (state.ledgerByIdempotency[input.idempotencyKey]) {
    const wallet = state.wallets[input.accountId];
    return {
      ok: true,
      data: { migrated: 0, wallet },
      state,
    };
  }
  const wallet = state.wallets[input.accountId];
  if (!wallet) {
    return {
      ok: false,
      code: "WALLET_NOT_FOUND",
      error: "Wallet not found",
      state,
    };
  }
  // If durable wallet already has balance, discard cookie credits.
  if (wallet.availableCredits > 0 || wallet.reservedCredits > 0) {
    const next = cloneState(state);
    next.consumedGuests[input.guestSessionIdHash] = {
      userId: input.userId,
      accountId: input.accountId,
      migratedCredits: 0,
      consumedAt: nowIso(),
    };
    return {
      ok: true,
      data: { migrated: 0, wallet },
      state: next,
    };
  }
  const migrated = Math.min(10, Math.max(0, Math.floor(input.cookieCredits)));
  if (migrated === 0) {
    const next = cloneState(state);
    next.consumedGuests[input.guestSessionIdHash] = {
      userId: input.userId,
      accountId: input.accountId,
      migratedCredits: 0,
      consumedAt: nowIso(),
    };
    return { ok: true, data: { migrated: 0, wallet }, state: next };
  }
  const granted = grantCredits(state, {
    accountId: input.accountId,
    credits: migrated,
    sourceType: "migration",
    sourceId: input.guestSessionIdHash,
    idempotencyKey: input.idempotencyKey,
  });
  if (!granted.ok) return granted;
  const next = cloneState(granted.state);
  next.consumedGuests[input.guestSessionIdHash] = {
    userId: input.userId,
    accountId: input.accountId,
    migratedCredits: migrated,
    consumedAt: nowIso(),
  };
  return {
    ok: true,
    data: {
      migrated,
      wallet: next.wallets[input.accountId],
    },
    state: next,
  };
}
