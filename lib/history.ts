/** Client-side generation history (Local Library). No server DB / cloud sync. */

import { canDownloadResult, freeLiveDownloadBlockReason } from "@/lib/createTrust";
import { resultProvenanceLabel } from "@/lib/provenance";

export type HistoryItem = {
  id: string;
  videoUrl: string;
  /** Device-local SKU/project grouping. Not a cloud project id. */
  projectId?: string;
  projectName?: string;
  /** Small local preview only; large uploads are intentionally not duplicated. */
  inputImage?: string;
  effect: string;
  effectName: string;
  model?: string;
  watermark?: boolean;
  demo?: boolean;
  duration?: number;
  aspectRatio?: string;
  resolution?: string;
  requestId?: string;
  /** Official Lab project id when generated via remix handoff */
  sourceProject?: string;
  /** Remix channel hint (etsy / reels / …) */
  channel?: string;
  status?: "succeeded";
  creditStatus?: "0 cached" | "10 used";
  createdAt: string;
};

/**
 * Free live raw provider URLs must not be treated as Library deliverables (T6).
 * Cached demos and paid (no watermark) remain downloadable.
 */
export function historyItemDownloadAllowed(
  item: Pick<HistoryItem, "demo" | "watermark">
): boolean {
  return canDownloadResult({
    demo: Boolean(item.demo),
    watermark: Boolean(item.watermark),
  });
}

export function historyDownloadBlockReason(): string {
  return freeLiveDownloadBlockReason();
}

/** Support / export helper — cached vs live without guessing from URL. */
export function historyProvenance(item: Pick<HistoryItem, "demo">): string {
  return resultProvenanceLabel(Boolean(item.demo));
}

const KEY = "pikbo_library_v1";
const MAX = 48;

function normalizeItem(raw: unknown): HistoryItem | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.videoUrl !== "string" || !o.videoUrl) return null;
  if (typeof o.effect !== "string" || typeof o.effectName !== "string") {
    return null;
  }
  return {
    id:
      typeof o.id === "string" && o.id
        ? o.id
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    videoUrl: o.videoUrl,
    projectId: typeof o.projectId === "string" ? o.projectId : undefined,
    projectName:
      typeof o.projectName === "string" ? o.projectName : undefined,
    inputImage:
      typeof o.inputImage === "string" &&
      (o.inputImage.startsWith("data:image/") || o.inputImage.startsWith("/"))
        ? o.inputImage
        : undefined,
    effect: o.effect,
    effectName: o.effectName,
    model: typeof o.model === "string" ? o.model : undefined,
    watermark: Boolean(o.watermark),
    demo: Boolean(o.demo),
    duration: typeof o.duration === "number" ? o.duration : undefined,
    aspectRatio: typeof o.aspectRatio === "string" ? o.aspectRatio : undefined,
    resolution: typeof o.resolution === "string" ? o.resolution : undefined,
    requestId: typeof o.requestId === "string" ? o.requestId : undefined,
    sourceProject:
      typeof o.sourceProject === "string" ? o.sourceProject : undefined,
    channel: typeof o.channel === "string" ? o.channel : undefined,
    status: "succeeded",
    creditStatus:
      o.creditStatus === "0 cached" || o.creditStatus === "10 used"
        ? o.creditStatus
        : Boolean(o.demo)
          ? "0 cached"
          : "10 used",
    createdAt:
      typeof o.createdAt === "string" && o.createdAt
        ? o.createdAt
        : new Date().toISOString(),
  };
}

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as unknown[];
    if (!Array.isArray(list)) return [];
    return list.map(normalizeItem).filter((x): x is HistoryItem => Boolean(x));
  } catch {
    return [];
  }
}

export function saveHistory(list: HistoryItem[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    // quota
  }
}

export function pushHistory(
  item: Omit<HistoryItem, "id" | "createdAt">
): HistoryItem[] {
  const next: HistoryItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const list = [next, ...loadHistory()].slice(0, MAX);
  saveHistory(list);
  return list;
}

export function removeHistoryItem(id: string): HistoryItem[] {
  const list = loadHistory().filter((i) => i.id !== id);
  saveHistory(list);
  return list;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

/**
 * Merge exported library JSON into local history (dedupe by id / videoUrl).
 * Returns new list length, or -1 on parse failure.
 */
export function importHistoryJson(text: string): number {
  try {
    const parsed = JSON.parse(text) as unknown;
    const arr = Array.isArray(parsed) ? parsed : null;
    if (!arr) return -1;
    const incoming = arr
      .map(normalizeItem)
      .filter((x): x is HistoryItem => Boolean(x));
    if (incoming.length === 0) return -1;

    const existing = loadHistory();
    const seen = new Set(existing.map((i) => i.id));
    const urls = new Set(existing.map((i) => i.videoUrl));
    const merged = [...existing];
    for (const item of incoming) {
      if (seen.has(item.id) || urls.has(item.videoUrl)) continue;
      seen.add(item.id);
      urls.add(item.videoUrl);
      merged.push(item);
    }
    merged.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    saveHistory(merged.slice(0, MAX));
    return Math.min(merged.length, MAX);
  } catch {
    return -1;
  }
}

/**
 * fal / provider CDN URLs are temporary. After ~5 days, re-download often fails.
 * Local /demos paths and data: never "expire" for this check.
 */
export function remoteClipMayExpire(item: {
  videoUrl: string;
  createdAt: string;
  demo?: boolean;
}): boolean {
  if (item.demo) return false;
  const url = item.videoUrl || "";
  if (!/^https?:\/\//i.test(url)) return false;
  const created = Date.parse(item.createdAt);
  if (!Number.isFinite(created)) return false;
  const ageMs = Date.now() - created;
  return ageMs > 5 * 24 * 60 * 60 * 1000;
}

/** Download a remote or local video (fal CORS allows *). Falls back to new tab. */
export async function downloadVideoFile(
  url: string,
  filename: string
): Promise<"ok" | "fallback" | "fail"> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), 45_000);
  try {
    // Relative /demos/... works same-origin; absolute fal needs CORS.
    const res = await fetch(url, { mode: "cors", signal: ctrl.signal });
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    if (!blob || blob.size < 32) throw new Error("empty");
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename.endsWith(".mp4") ? filename : `${filename}.mp4`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
    return "ok";
  } catch {
    try {
      window.open(url, "_blank", "noopener,noreferrer");
      return "fallback";
    } catch {
      return "fail";
    }
  } finally {
    window.clearTimeout(timer);
  }
}

/** Backup library as JSON file for the user / support. */
export function exportHistoryJson(): void {
  const list = loadHistory().map((item) => ({
    ...item,
    /** Soft-launch PRD ops: identify cached demo vs live without guessing. */
    provenance: historyProvenance(item),
    storage: "local-browser",
  }));
  const blob = new Blob([JSON.stringify(list, null, 2)], {
    type: "application/json",
  });
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = `pikbo-library-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}
