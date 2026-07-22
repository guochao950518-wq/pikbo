const KEY = "pikbo_favorite_effects";

export function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as string[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(slug: string): string[] {
  const cur = loadFavorites();
  const next = cur.includes(slug)
    ? cur.filter((s) => s !== slug)
    : [slug, ...cur].slice(0, 24);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function isFavorite(slug: string): boolean {
  return loadFavorites().includes(slug);
}
