"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  clearHistory,
  downloadVideoFile,
  exportHistoryJson,
  importHistoryJson,
  loadHistory,
  remoteClipMayExpire,
  removeHistoryItem,
  type HistoryItem,
} from "@/lib/history";
import { useToast } from "@/components/Toast";
import { PROVENANCE, resultProvenanceLabel } from "@/lib/provenance";

type KindFilter = "all" | "live" | "demo";

export function LibraryGrid() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [sort, setSort] = useState<"new" | "name">("new");
  const toast = useToast();

  useEffect(() => {
    const t = window.setTimeout(() => {
      setItems(loadHistory());
      setReady(true);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const effectNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const i of items) map.set(i.effect, i.effectName);
    return [...map.entries()];
  }, [items]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    let list = items;
    if (kind === "live") list = list.filter((i) => !i.demo);
    if (kind === "demo") list = list.filter((i) => i.demo);
    if (q) {
      list = list.filter(
        (i) =>
          i.effectName.toLowerCase().includes(q) ||
          i.effect.toLowerCase().includes(q)
      );
    }
    if (sort === "name") {
      list = [...list].sort((a, b) =>
        a.effectName.localeCompare(b.effectName)
      );
    }
    return list;
  }, [items, filter, sort, kind]);

  function onImportFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const n = importHistoryJson(text);
      if (n < 0) {
        toast("Import failed — need a Pikbo library JSON export");
        return;
      }
      setItems(loadHistory());
      toast(`Library restored · ${n} clip${n === 1 ? "" : "s"}`);
    };
    reader.onerror = () => toast("Could not read file");
    reader.readAsText(file);
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied");
    } catch {
      toast("Could not copy");
    }
  }

  async function downloadClip(item: HistoryItem) {
    const name = `pikbo-${item.effect}-${item.id.slice(0, 8)}.mp4`;
    const result = await downloadVideoFile(item.videoUrl, name);
    if (result === "ok") toast("Download started");
    else if (result === "fallback") toast("Opened video — save from browser");
    else toast("Download failed");
  }

  if (!ready) {
    return (
      <p className="py-20 text-center text-sm text-[var(--fg-dim)]">Loading…</p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] py-20 text-center">
        <p className="text-3xl">▢</p>
        <p className="mt-3 text-[var(--fg-muted)]">No saved results on this device yet</p>
        <p className="mt-2 max-w-sm text-xs text-[var(--fg-dim)]">
          {PROVENANCE.localLibrary} · this browser only (not cloud-synced).
          Without provider access, Studio saves a labeled{" "}
          {PROVENANCE.cachedDemo.toLowerCase()} that does not animate your upload.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/create" className="btn btn-primary text-sm">
            Open Studio
          </Link>
          <Link href="/community" className="btn btn-ghost text-sm">
            Try a PIKBO Lab recipe
          </Link>
          <Link href="/effects" className="btn btn-ghost text-sm">
            Browse presets
          </Link>
          <Link
            href="/effects/360-spin-showcase"
            className="btn btn-ghost text-sm"
          >
            360° spin tool
          </Link>
          <Link href="/supercomputer" className="btn btn-ghost text-sm">
            Batch
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by preset…"
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1.5 text-sm outline-none focus:border-[var(--brand)]"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "new" | "name")}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-2 py-1.5 text-xs outline-none"
          >
            <option value="new">Newest</option>
            <option value="name">By name</option>
          </select>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as KindFilter)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-2 py-1.5 text-xs outline-none"
            aria-label="Filter live vs cached demo"
          >
            <option value="all">All kinds</option>
            <option value="live">{PROVENANCE.liveGeneration}</option>
            <option value="demo">{PROVENANCE.cachedDemo}s</option>
          </select>
          <span className="text-[10px] text-[var(--fg-dim)]">
            {filtered.length} / {items.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-xs text-[var(--fg-muted)] hover:text-[var(--mint)]"
            onClick={() => {
              exportHistoryJson();
              toast("Library JSON exported");
            }}
          >
            Export JSON
          </button>
          <label className="cursor-pointer text-xs text-[var(--fg-muted)] hover:text-[var(--mint)]">
            Import JSON
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                onImportFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          <button
            type="button"
            className="text-xs text-[var(--fg-dim)] hover:text-[var(--brand)]"
            onClick={() => {
              if (confirm("Clear all clips from this browser?")) {
                clearHistory();
                setItems([]);
              }
            }}
          >
            Clear all
          </button>
        </div>
      </div>

      {effectNames.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFilter("")}
            className={`rounded-full border px-2.5 py-0.5 text-[10px] ${
              !filter
                ? "border-[var(--brand)] text-[var(--fg)]"
                : "border-[var(--border)] text-[var(--fg-dim)]"
            }`}
          >
            All
          </button>
          {effectNames.map(([slug, name]) => (
            <button
              key={slug}
              type="button"
              onClick={() => setFilter(name)}
              className={`rounded-full border px-2.5 py-0.5 text-[10px] ${
                filter === name
                  ? "border-[var(--brand)] text-[var(--fg)]"
                  : "border-[var(--border)] text-[var(--fg-dim)]"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <article key={item.id} className="card group overflow-hidden p-0">
            <div className="relative aspect-video bg-black/50">
              <video
                src={item.videoUrl}
                className="h-full w-full object-contain"
                controls
                muted
                playsInline
                preload="metadata"
              />
              <div className="pointer-events-none absolute left-2 top-2 flex flex-wrap gap-1">
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-white/90 ${
                    item.demo ? "bg-black/70" : "bg-[var(--mint)]/80 text-black"
                  }`}
                >
                  {resultProvenanceLabel(Boolean(item.demo))}
                </span>
                {item.watermark && (
                  <span className="rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white/80">
                    {PROVENANCE.onPlayerMark}
                  </span>
                )}
                {remoteClipMayExpire(item) && (
                  <span className="rounded bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-black">
                    link aging
                  </span>
                )}
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold">{item.effectName}</p>
              <p className="mt-0.5 text-[10px] text-[var(--fg-dim)]">
                {new Date(item.createdAt).toLocaleString()}
                {item.model ? ` · ${item.model.split("/").pop()}` : ""}
                {item.duration ? ` · ${item.duration}s` : ""}
                {item.aspectRatio ? ` · ${item.aspectRatio}` : ""}
                {item.resolution ? ` · ${item.resolution}` : ""}
              </p>
              {remoteClipMayExpire(item) && (
                <p className="mt-1 text-[10px] text-amber-600/90">
                  Provider CDN links expire — download soon or re-generate.
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                <button
                  type="button"
                  onClick={() => void downloadClip(item)}
                  className="text-xs font-medium text-[var(--mint)] hover:underline"
                >
                  Download
                </button>
                <button
                  type="button"
                  className="text-xs text-[var(--fg-muted)] hover:text-[var(--mint)]"
                  onClick={() => void copyLink(item.videoUrl)}
                >
                  Copy link
                </button>
                <Link
                  href={`/effects/${item.effect}`}
                  className="text-xs text-[var(--fg-muted)] hover:text-[var(--mint)]"
                >
                  Tool page
                </Link>
                <Link
                  href={`/create?effect=${item.effect}`}
                  className="text-xs text-[var(--fg-muted)] hover:text-[var(--mint)]"
                >
                  Studio
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
          No saved results match this filter
        </p>
      )}
    </div>
  );
}
