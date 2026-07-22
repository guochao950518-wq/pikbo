"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  clearHistory,
  loadHistory,
  removeHistoryItem,
  type HistoryItem,
} from "@/lib/history";

type CloudJob = {
  id: string;
  presetId: string;
  status: "queued" | "running" | "succeeded" | "failed" | "canceled";
  progress: number;
  outputUrl?: string;
  posterUrl?: string;
  demo: boolean;
  watermark: boolean;
  model: string;
  error?: string;
  chargedCredits: number;
  updatedAt: string;
};

export function LibraryGrid() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState("");
  const [cloudJobs, setCloudJobs] = useState<CloudJob[]>([]);
  const [cloudReady, setCloudReady] = useState(false);
  const [cloudPersisted, setCloudPersisted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setItems(loadHistory());
      setReady(true);
    }, 0);
    fetch("/api/generations", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { jobs?: CloudJob[]; persisted?: boolean }) => {
        setCloudJobs(data.jobs ?? []);
        setCloudPersisted(Boolean(data.persisted));
      })
      .catch(() => {})
      .finally(() => setCloudReady(true));
    return () => window.clearTimeout(timer);
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

  if (!ready || !cloudReady) {
    return (
      <p className="py-20 text-center text-sm text-[var(--fg-dim)]">Loading…</p>
    );
  }

  if (items.length === 0 && cloudJobs.length === 0) {
    return (
      <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] py-24 text-center">
        <p className="text-[var(--fg-muted)]">No clips yet</p>
        <p className="mt-2 max-w-sm text-xs text-[var(--fg-dim)]">
          Signed-in generations appear here from the cloud. Guest legacy clips
          remain on this browser only.
        </p>
        <Link href="/create" className="btn btn-primary mt-6 text-sm">
          Open Generate
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--mint)]">
              {cloudPersisted ? "Cloud library" : "Validation tasks"}
            </p>
            <h2 className="mt-1 text-lg font-semibold">Tracked generation jobs</h2>
          </div>
          <Link href="/create" className="text-xs text-[var(--brand)] hover:underline">
            New clip →
          </Link>
        </div>
        {cloudJobs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cloudJobs.map((job) => (
              <article key={job.id} className="card overflow-hidden p-0">
                <div className="grid aspect-video place-items-center bg-black/50">
                  {job.outputUrl ? (
                    <video
                      src={job.outputUrl}
                      poster={job.posterUrl}
                      className="h-full w-full object-contain"
                      controls
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <div className="px-4 text-center text-xs text-[var(--fg-dim)]">
                      {job.status === "failed" ? job.error || "Generation failed" : `${job.status} · ${job.progress}%`}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{job.presetId.replaceAll("-", " ")}</p>
                    <span className="chip text-[9px]">{job.demo ? "validation" : job.status}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-[var(--fg-dim)]">
                    {job.model} · {job.chargedCredits} credits
                    {job.watermark ? " · watermarked" : ""}
                  </p>
                  <Link href={`/create?effect=${job.presetId}`} className="mt-2 inline-block text-xs text-[var(--mint)] hover:underline">
                    Create another version →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-xs text-[var(--fg-dim)]">
            No tracked cloud jobs yet.
          </p>
        )}
      </section>

      <div className="my-8 border-t border-[var(--border)]" />
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-dim)]">
        Legacy device library
      </p>
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
