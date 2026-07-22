"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  clearHistory,
  loadHistory,
  removeHistoryItem,
  type HistoryItem,
} from "@/lib/history";

export function LibraryGrid() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setItems(loadHistory());
    setReady(true);
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.effectName.toLowerCase().includes(q) ||
        i.effect.toLowerCase().includes(q)
    );
  }, [items, filter]);

  if (!ready) {
    return (
      <p className="py-20 text-center text-sm text-[var(--fg-dim)]">Loading…</p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] py-24 text-center">
        <p className="text-[var(--fg-muted)]">No clips yet</p>
        <p className="mt-2 max-w-sm text-xs text-[var(--fg-dim)]">
          Generations from this browser are saved here. Open Generate to make
          your first clip.
        </p>
        <Link href="/create" className="btn btn-primary mt-6 text-sm">
          Open Generate
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by preset…"
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1.5 text-sm outline-none focus:border-[var(--brand)]"
        />
        <button
          type="button"
          className="text-xs text-[var(--fg-dim)] hover:text-[var(--brand)]"
          onClick={() => {
            clearHistory();
            setItems([]);
          }}
        >
          Clear all
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <article key={item.id} className="card overflow-hidden p-0">
            <div className="aspect-video bg-black/50">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                src={item.videoUrl}
                className="h-full w-full object-contain"
                controls
                muted
                playsInline
                preload="metadata"
              />
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold">{item.effectName}</p>
              <p className="mt-0.5 text-[10px] text-[var(--fg-dim)]">
                {new Date(item.createdAt).toLocaleString()}
                {item.demo ? " · demo" : ""}
                {item.watermark ? " · watermark" : ""}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link
                  href={`/create?effect=${item.effect}`}
                  className="text-xs font-medium text-[var(--mint)] hover:underline"
                >
                  Run again →
                </Link>
                <button
                  type="button"
                  className="text-xs text-[var(--fg-dim)] hover:text-[var(--brand)]"
                  onClick={() => setItems(removeHistoryItem(item.id))}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-[var(--fg-dim)]">
          No clips match filter
        </p>
      )}
    </div>
  );
}
