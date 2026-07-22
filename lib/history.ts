/** Client-side generation history (Library). No server DB yet. */

export type HistoryItem = {
  id: string;
  videoUrl: string;
  effect: string;
  effectName: string;
  model?: string;
  watermark?: boolean;
  demo?: boolean;
  createdAt: string;
};

const KEY = "pikbo_library_v1";
const MAX = 48;

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(list) ? list : [];
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
