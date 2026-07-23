/**
 * Toy Identity — first-principles SKU lock (not OpenArt Character / Soul ID).
 *
 * Physics: one photo of a real toy the user owns.
 * Product truth: same toy across clips beats multi-model theater.
 * Five-step: 2 optional fields only; no LoRA, no cloud character train, no 3D.
 *
 * Server already appends TOY_IDENTITY_LOCK via buildGeneratePrompt.
 * This layer only adds optional SKU name + "preserve" notes into `extra`.
 */

import { MAX_EXTRA_CHARS, sanitizeExtra } from "@/lib/promptBuild";

export type ToyIdentity = {
  /** Short nickname / SKU label (e.g. "Scout #3 pink") */
  sku: string;
  /** What must not change (paint, logo, sculpt) */
  preserve: string;
};

const STORAGE_KEY = "pikbo_toy_identity_v1";
const MAX_SKU = 48;
const MAX_PRESERVE = 120;

export const EMPTY_TOY_IDENTITY: ToyIdentity = { sku: "", preserve: "" };

export function sanitizeSku(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.trim().slice(0, MAX_SKU);
}

export function sanitizePreserve(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.trim().slice(0, MAX_PRESERVE);
}

export function sanitizeToyIdentity(raw: Partial<ToyIdentity> | null | undefined): ToyIdentity {
  return {
    sku: sanitizeSku(raw?.sku),
    preserve: sanitizePreserve(raw?.preserve),
  };
}

/** Compose optional identity into the user extra string sent to generate. */
export function composeExtraWithIdentity(
  identity: ToyIdentity,
  userExtra: unknown
): string {
  const base = sanitizeExtra(userExtra);
  const id = sanitizeToyIdentity(identity);
  const parts: string[] = [];
  if (id.sku) {
    parts.push(`Toy SKU/name: ${id.sku}.`);
  }
  if (id.preserve) {
    parts.push(`Preserve exactly: ${id.preserve}.`);
  }
  if (parts.length === 0) return base;
  const identityBlock = parts.join(" ");
  if (!base) return identityBlock.slice(0, MAX_EXTRA_CHARS);
  return `${base} ${identityBlock}`.trim().slice(0, MAX_EXTRA_CHARS);
}

export function loadToyIdentity(): ToyIdentity {
  if (typeof window === "undefined") return { ...EMPTY_TOY_IDENTITY };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_TOY_IDENTITY };
    return sanitizeToyIdentity(JSON.parse(raw) as Partial<ToyIdentity>);
  } catch {
    return { ...EMPTY_TOY_IDENTITY };
  }
}

export function saveToyIdentity(identity: ToyIdentity): ToyIdentity {
  const next = sanitizeToyIdentity(identity);
  if (typeof window === "undefined") return next;
  try {
    if (!next.sku && !next.preserve) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    /* quota / private mode */
  }
  return next;
}

/** Library grouping label — empty when user skipped identity. */
export function identityProjectName(identity: ToyIdentity): string | undefined {
  const sku = sanitizeSku(identity.sku);
  return sku || undefined;
}
