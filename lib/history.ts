/** Client-side generation history (Library). No server DB yet. */

export type HistoryItem = {
  id: string;
  videoUrl: string;
  effect: string;
  effectName: string;
  model?: string;
  watermark?: boolean;
  demo?: boolean;
  duration?: number;
  aspectRatio?: string;
  resolution?: string;
  requestId?: string;
  createdAt: string;
};

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
    effect: o.effect,
    effectName: o.effectName,
    model: typeof o.model === "string" ? o.model : undefined,
    watermark: Boolean(o.watermark),
    demo: Boolean(o.demo),
    duration: typeof o.duration === "number" ? o.duration : undefined,
    aspectRatio: typeof o.aspectRatio === "string" ? o.aspectRatio : undefined,
    resolution: typeof o.resolution === "string" ? o.resolution : undefined,
    requestId: typeof o.requestId === "string" ? o.requestId : undefined,
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

/** Download a remote or local video (fal CORS allows *). Falls back to new tab. */
export async function downloadVideoFile(
  url: string,
  filename: string
): Promise<"ok" | "fallback" | "fail"> {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
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
  }
}

/** Backup library as JSON file for the user. */
export function exportHistoryJson(): void {
  const list = loadHistory();
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
