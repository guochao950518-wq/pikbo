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
const TTL_MS = 15 * 60 * 1000;
const assets = new Map<string, LocalAsset>();

function nowIso() {
  return new Date().toISOString();
}

function trimExpired() {
  const t = Date.now();
  for (const [id, a] of assets) {
    if (Date.parse(a.expiresAt) < t) assets.delete(id);
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
    createdAt: nowIso(),
    expiresAt: new Date(Date.now() + TTL_MS).toISOString(),
  };
  assets.set(asset.id, asset);
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
  return a;
}

export function localAssetMaxBytes() {
  return MAX_BYTES;
}

export function __resetLocalAssetsForTests() {
  assets.clear();
}
