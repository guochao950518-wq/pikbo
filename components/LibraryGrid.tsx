"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearHistory, loadHistory, type HistoryItem } from "@/lib/history";

export function LibraryGrid() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadHistory());
    setReady(true);
  }, []);

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
          Generations from this browser are saved here (local). Open Generate to
          make your first clip.
        </p>
        <Link href="/create" className="btn btn-primary mt-6 text-sm">
          Open Generate
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          className="text-xs text-[var(--fg-dim)] hover:text-[var(--brand)]"
          onClick={() => {
            clearHistory();
            setItems([]);
          }}
        >
          Clear library
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
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
              <Link
                href={`/create?effect=${item.effect}`}
                className="mt-2 inline-block text-xs font-medium text-[var(--mint)] hover:underline"
              >
                Run again →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
