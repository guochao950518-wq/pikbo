/**
 * File-backed durable credits for local / single-node dev.
 * Not a production multi-region store — Supabase is the production path.
 */

import { promises as fs } from "fs";
import path from "path";
import type { DurableState } from "@/lib/durableCredits/types";
import { emptyState } from "@/lib/durableCredits/engine";

function storePath(): string {
  if (process.env.DURABLE_CREDITS_PATH) return process.env.DURABLE_CREDITS_PATH;
  return path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "data",
    "durable-credits.json"
  );
}

export async function loadDurableState(): Promise<DurableState> {
  try {
    const raw = await fs.readFile(storePath(), "utf8");
    const parsed = JSON.parse(raw) as DurableState;
    if (!parsed || typeof parsed !== "object" || !parsed.wallets) {
      return emptyState();
    }
    return {
      ...emptyState(),
      ...parsed,
      accounts: parsed.accounts ?? {},
      wallets: parsed.wallets ?? {},
      reservations: parsed.reservations ?? {},
      ledger: Array.isArray(parsed.ledger) ? parsed.ledger : [],
      ledgerByIdempotency: parsed.ledgerByIdempotency ?? {},
      reservationByIdempotency: parsed.reservationByIdempotency ?? {},
      consumedGuests: parsed.consumedGuests ?? {},
    };
  } catch {
    return emptyState();
  }
}

export async function saveDurableState(state: DurableState): Promise<void> {
  const file = storePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(state, null, 2), "utf8");
}

export async function probeDurableCreditsStore(): Promise<{
  writable: boolean;
  path: string;
  backend: "local-file" | "supabase" | "none";
  required: boolean;
  configured: boolean;
  warning?: string;
}> {
  const required = process.env.REQUIRE_DURABLE_CREDITS === "1";
  const supabase =
    Boolean(process.env.SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (supabase) {
    return {
      writable: true,
      path: "supabase",
      backend: "supabase",
      required,
      configured: true,
      warning: "Supabase adapter not fully wired — schema migration ready",
    };
  }
  const file = storePath();
  try {
    await fs.mkdir(path.dirname(file), { recursive: true });
    const probe = `${file}.probe`;
    await fs.writeFile(probe, String(Date.now()), "utf8");
    await fs.unlink(probe).catch(() => undefined);
    return {
      writable: true,
      path: file,
      backend: "local-file",
      required,
      configured: true,
    };
  } catch {
    return {
      writable: false,
      path: file,
      backend: required ? "none" : "local-file",
      required,
      configured: false,
      warning: required
        ? "REQUIRE_DURABLE_CREDITS=1 but store unwritable and Supabase unset"
        : "Local durable store unwritable",
    };
  }
}
