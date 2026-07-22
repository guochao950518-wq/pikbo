export type ImageHistoryItem = {
  id: string;
  imageUrl: string;
  prompt: string;
  demo?: boolean;
  createdAt: string;
};

const KEY = "pikbo_image_library_v1";
const MAX = 24;

export function loadImageHistory(): ImageHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as ImageHistoryItem[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function pushImageHistory(
  item: Omit<ImageHistoryItem, "id" | "createdAt">
): ImageHistoryItem[] {
  const next: ImageHistoryItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  // data URLs can be large — skip storing huge demo svg if needed
  const list = [next, ...loadImageHistory()].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // quota — drop older
    try {
      localStorage.setItem(KEY, JSON.stringify(list.slice(0, 8)));
    } catch {
      // ignore
    }
  }
  return list;
}

export function removeImageHistoryItem(id: string): ImageHistoryItem[] {
  const list = loadImageHistory().filter((i) => i.id !== id);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
  return list;
}

export function clearImageHistory(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
