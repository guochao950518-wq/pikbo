/**
 * Process-memory asset registry for Phase D local upload path.
 * Not multi-node durable — production needs object storage.
 */

export type LocalAsset = {
  id: string;
  sessionId: string;
  contentType: string;
  /** data URL for soft-launch generate compatibility */
  dataUrl: string;
  byteLength: number;
  createdAt: string;
  expiresAt: string;
};

const MAX_BYTES = 8_000_000;
/** Soft-launch still TTL. Active gets slide this window forward. */
const TTL_MS = 15 * 60 * 1000;
const assets = new Map<string, LocalAsset>();
/**
 * Ids minted by POST /api/assets/upload-url before PUT body arrives.
 * Prevents another session from claiming a reserved id.
 */
const reservations = new Map<
  string,
  { sessionId: string; expiresAt: number }
>();

function nowIso() {
  return new Date().toISOString();
}

function trimExpired() {
  const t = Date.now();
  for (const [id, a] of assets) {
    if (Date.parse(a.expiresAt) < t) assets.delete(id);
  }
  for (const [id, r] of reservations) {
    if (r.expiresAt < t) reservations.delete(id);
  }
  if (assets.size > 100) {
    const ordered = [...assets.values()].sort((x, y) =>
      x.createdAt.localeCompare(y.createdAt)
    );
    for (const drop of ordered.slice(0, assets.size - 80)) {
      assets.delete(drop.id);
    }
  }
}

function slideExpiry(asset: LocalAsset): LocalAsset {
  const next: LocalAsset = {
    ...asset,
    expiresAt: new Date(Date.now() + TTL_MS).toISOString(),
  };
  assets.set(next.id, next);
  return next;
}

/**
 * Reserve an asset id for a session after upload-url mint.
 * PUT must match the same session (or no reservation for legacy paths).
 */
export function reserveLocalAssetId(input: {
  id: string;
  sessionId: string;
}):
  | { ok: true; expiresAt: string }
  | { ok: false; code: string; error: string } {
  trimExpired();
  const existing = assets.get(input.id);
  if (existing && existing.sessionId !== input.sessionId) {
    // Extremely unlikely UUID collision with foreign owner — reject.
    return {
      ok: false,
      code: "CONFLICT",
      error: "Asset id already owned by another session",
    };
  }
  const prior = reservations.get(input.id);
  if (prior && prior.sessionId !== input.sessionId && prior.expiresAt > Date.now()) {
    return {
      ok: false,
      code: "CONFLICT",
      error: "Asset id already reserved by another session",
    };
  }
  const expiresAtMs = Date.now() + TTL_MS;
  reservations.set(input.id, {
    sessionId: input.sessionId,
    expiresAt: expiresAtMs,
  });
  return { ok: true, expiresAt: new Date(expiresAtMs).toISOString() };
}

export function putLocalAsset(input: {
  id: string;
  sessionId: string;
  contentType: string;
  bytes: Buffer;
}): { ok: true; asset: LocalAsset } | { ok: false; code: string; error: string } {
  trimExpired();
  if (input.bytes.length === 0) {
    return { ok: false, code: "EMPTY", error: "Empty body" };
  }
  if (input.bytes.length > MAX_BYTES) {
    return {
      ok: false,
      code: "IMAGE_TOO_LARGE",
      error: `Max ${MAX_BYTES} bytes`,
    };
  }

  // Ownership: cannot overwrite another session's stored still.
  const existing = assets.get(input.id);
  if (existing && existing.sessionId !== input.sessionId) {
    return {
      ok: false,
      code: "NOT_OWNED",
      error: "Asset belongs to another session",
    };
  }

  // Ownership: reservation from upload-url must match (when present).
  const reserved = reservations.get(input.id);
  if (reserved) {
    if (reserved.sessionId !== input.sessionId) {
      return {
        ok: false,
        code: "NOT_OWNED",
        error: "Asset id reserved for another session",
      };
    }
    if (reserved.expiresAt < Date.now()) {
      reservations.delete(input.id);
      return {
        ok: false,
        code: "EXPIRED",
        error: "Upload reservation expired — request a new upload-url",
      };
    }
  }

  const ct = input.contentType.startsWith("image/")
    ? input.contentType.slice(0, 64)
    : "application/octet-stream";
  const b64 = input.bytes.toString("base64");
  const dataUrl = `data:${ct};base64,${b64}`;
  const asset: LocalAsset = {
    id: input.id,
    sessionId: input.sessionId,
    contentType: ct,
    dataUrl,
    byteLength: input.bytes.length,
    createdAt: existing?.createdAt ?? nowIso(),
    expiresAt: new Date(Date.now() + TTL_MS).toISOString(),
  };
  assets.set(asset.id, asset);
  // Reservation consumed on successful put.
  reservations.delete(input.id);
  return { ok: true, asset };
}

export function getLocalAsset(
  id: string,
  sessionId: string
): LocalAsset | null {
  trimExpired();
  const a = assets.get(id);
  if (!a || a.sessionId !== sessionId) return null;
  if (Date.parse(a.expiresAt) < Date.now()) {
    assets.delete(id);
    return null;
  }
  // Sliding TTL while actively used (Seller Pack children / Retry).
  return slideExpiry(a);
}

export function localAssetMaxBytes() {
  return MAX_BYTES;
}

export function localAssetTtlMs() {
  return TTL_MS;
}

/** Ops probe — presence only, never echoes image bytes. */
export function localAssetsProbe(): {
  mode: "local-memory";
  durable: false;
  count: number;
  reserved: number;
  maxBytes: number;
  ttlMs: number;
  note: string;
} {
  trimExpired();
  return {
    mode: "local-memory",
    durable: false,
    count: assets.size,
    reserved: reservations.size,
    maxBytes: MAX_BYTES,
    ttlMs: TTL_MS,
    note: "Process-memory stills; session-owned put; active get slides TTL. Not multi-node.",
  };
}

export function __resetLocalAssetsForTests() {
  assets.clear();
  reservations.clear();
}
