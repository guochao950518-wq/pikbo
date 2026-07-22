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
