"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  clearHistory,
  downloadVideoFile,
  exportHistoryJson,
  historyDownloadBlockReason,
  historyItemDownloadAllowed,
  importHistoryJson,
  loadHistory,
  remoteClipMayExpire,
  removeHistoryItem,
  type HistoryItem,
} from "@/lib/history";
import { createRemixHref } from "@/lib/remixIntent";
import { useToast } from "@/components/Toast";
import { PROVENANCE, resultProvenanceLabel } from "@/lib/provenance";
import { track } from "@/lib/analytics";

type KindFilter = "all" | "live" | "demo";
type GroupMode = "flat" | "project";

type SessionJob = {
  id: string;
  status: string;
  effect: string;
  demo?: boolean;
  downloadAllowed?: boolean;
  videoUrl?: string;
  creditsOutcome?: string;
  requestId?: string;
  error?: string;
  createdAt?: string;
};

function isCancellableSessionJob(status: string): boolean {
  return status === "queued" || status === "running";
}

/** Phase D: process-memory ledger — must show even when device history is empty. */
function SessionJobsPanel({
  jobs,
  cancellingId,
  onCancel,
  onRefresh,
}: {
  jobs: SessionJob[];
  cancellingId: string | null;
  onCancel: (id: string) => void;
  onRefresh: () => void;
}) {
  if (jobs.length === 0) return null;
  return (
    <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-[var(--fg-dim)]">
            Session jobs · this server process
          </p>
          <p className="mt-1 text-xs text-[var(--fg-muted)]">
            Local ledger from Generate (not multi-node cloud). Device Library
            below is this browser only — empty until a clip is saved here.
            Cancel marks the ledger only; in-flight fal may still finish.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onRefresh}
            className="text-[11px] font-semibold text-[var(--fg-muted)] hover:text-white"
          >
            Refresh
          </button>
          <Link
            href="/create"
            className="text-[11px] font-semibold text-[var(--mint)] hover:underline"
          >
            Open Create →
          </Link>
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {jobs.map((j) => (
          <li
            key={j.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold text-[var(--fg)]">
                {j.effect}{" "}
                <span className="font-normal text-[var(--fg-dim)]">
                  · {j.status}
                  {j.creditsOutcome ? ` · ${j.creditsOutcome}` : ""}
                </span>
              </p>
              {j.error ? (
                <p className="mt-0.5 truncate text-[10px] text-amber-100/80">
                  {j.error}
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                href={`/create?effect=${encodeURIComponent(j.effect)}`}
                className="text-[var(--mint)] hover:underline"
              >
                Retry recipe
              </Link>
              {isCancellableSessionJob(j.status) ? (
                <button
                  type="button"
                  disabled={cancellingId === j.id}
                  onClick={() => onCancel(j.id)}
                  className="text-amber-100/80 hover:text-amber-50 disabled:opacity-50"
                  title="Marks local ledger canceled — does not kill provider mid-flight"
                >
                  {cancellingId === j.id ? "Canceling…" : "Cancel ledger"}
                </button>
              ) : null}
              {j.status === "succeeded" && j.downloadAllowed && j.videoUrl ? (
                <a
                  href={
                    j.requestId || j.id
                      ? `/api/downloads/${encodeURIComponent(j.requestId || j.id)}`
                      : j.videoUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--fg-muted)] hover:text-white"
                >
                  Download
                </a>
              ) : j.status === "succeeded" && !j.downloadAllowed ? (
                <span className="text-amber-100/70">Download blocked</span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LibraryGrid() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [sort, setSort] = useState<"new" | "name">("new");
  /** Wave A: group device-local clips by remix/sample project key */
  const [groupMode, setGroupMode] = useState<GroupMode>("project");
  const [sessionJobs, setSessionJobs] = useState<SessionJob[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const t = window.setTimeout(() => {
      setItems(loadHistory());
      setReady(true);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  async function refreshSessionJobs() {
    try {
      const r = await fetch("/api/generations");
      const body = (await r.json()) as { ok?: boolean; jobs?: SessionJob[] };
      if (!body?.ok || !Array.isArray(body.jobs)) return;
      setSessionJobs(body.jobs.slice(0, 12));
    } catch {
      /* ignore */
    }
  }

  // Phase D: process-memory job ledger for this browser session (refresh recovery).
  useEffect(() => {
    let cancelled = false;
    const t = window.setTimeout(() => {
      void fetch("/api/generations")
        .then((r) => r.json())
        .then((body: { ok?: boolean; jobs?: SessionJob[] }) => {
          if (cancelled || !body?.ok || !Array.isArray(body.jobs)) return;
          setSessionJobs(body.jobs.slice(0, 12));
        })
        .catch(() => undefined);
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  // Poll while any job is still open so TIMEOUT/cancel/success surfaces without reload.
  useEffect(() => {
    const open = sessionJobs.some((j) => isCancellableSessionJob(j.status));
    if (!open) return;
    const t = window.setInterval(() => {
      void fetch("/api/generations")
        .then((r) => r.json())
        .then((body: { ok?: boolean; jobs?: SessionJob[] }) => {
          if (!body?.ok || !Array.isArray(body.jobs)) return;
          setSessionJobs(body.jobs.slice(0, 12));
        })
        .catch(() => undefined);
    }, 8000);
    return () => window.clearInterval(t);
  }, [sessionJobs]);

  async function cancelSessionJob(id: string) {
    setCancellingId(id);
    try {
      const res = await fetch(`/api/generations/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const body = (await res.json()) as {
        ok?: boolean;
        message?: string;
        note?: string;
        code?: string;
      };
      if (!res.ok || !body.ok) {
        toast(body.message || body.code || "Could not cancel job");
      } else {
        toast(
          body.note ||
            "Ledger canceled · in-flight provider may still complete"
        );
      }
      await refreshSessionJobs();
    } catch {
      toast("Network error canceling job");
    } finally {
      setCancellingId(null);
    }
  }

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
          i.effect.toLowerCase().includes(q) ||
          (i.projectName || "").toLowerCase().includes(q) ||
          (i.projectId || "").toLowerCase().includes(q) ||
          (i.sourceProject || "").toLowerCase().includes(q) ||
          (i.sku || "").toLowerCase().includes(q)
      );
    }
    if (sort === "name") {
      list = [...list].sort((a, b) =>
        a.effectName.localeCompare(b.effectName)
      );
    }
    return list;
  }, [items, filter, sort, kind]);

  /** Group by the existing device-local project metadata; never imply cloud sync. */
  const grouped = useMemo(() => {
    if (groupMode !== "project") {
      return [
        { key: "all", label: "All clips", input: undefined, items: filtered },
      ];
    }
    const map = new Map<string, HistoryItem[]>();
    for (const item of filtered) {
      const key =
        item.projectId?.trim() ||
        item.sourceProject?.trim() ||
        `legacy-${item.effect}`;
      const list = map.get(key) || [];
      list.push(item);
      map.set(key, list);
    }
    return [...map.entries()]
      .map(([key, groupItems]) => {
        const named = groupItems.find((item) => item.projectName)?.projectName;
        const input = groupItems.find((item) => item.inputImage)?.inputImage;
        return {
          key,
          label:
            named ||
            (key.includes("lab-sample-")
              ? `PIKBO Lab sample · ${key.split("lab-sample-").pop()}`
              : key.startsWith("legacy-")
                ? `Legacy project · ${groupItems[0]?.effectName ?? "clip"}`
                : `Owned toy project · ${key.replace(/^local-/, "")}`),
          input,
          items: groupItems,
        };
      })
      .sort((a, b) => {
        return a.label.localeCompare(b.label);
      });
  }, [filtered, groupMode]);

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
    if (!historyItemDownloadAllowed(item)) {
      toast(historyDownloadBlockReason());
      return;
    }
    track({
      event: "export_click",
      path: "/library",
      recipe: item.effect,
      demo: Boolean(item.demo),
      meta: {
        via: item.requestId ? "downloads_api" : "direct",
        sku: item.sku || null,
      },
    });
    // Prefer controlled download endpoint when we have a server job id.
    if (item.requestId) {
      window.open(
        `/api/downloads/${encodeURIComponent(item.requestId)}`,
        "_blank",
        "noopener,noreferrer"
      );
      toast("Download via server gate…");
      return;
    }
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

  // Device history empty: still surface process-memory session jobs (Phase D recovery).
  if (items.length === 0) {
    return (
      <div className="mt-8">
        <SessionJobsPanel
          jobs={sessionJobs}
          cancellingId={cancellingId}
          onCancel={(id) => void cancelSessionJob(id)}
          onRefresh={() => void refreshSessionJobs()}
        />
        <div className="grid place-items-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] py-16 text-center sm:py-20">
          <p className="text-3xl">▢</p>
          <p className="mt-3 text-base font-semibold text-[var(--fg)]">
            {sessionJobs.length > 0
              ? "No clips saved on this device yet"
              : "Your first listing clip starts on Create"}
          </p>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-[var(--fg-dim)]">
            {sessionJobs.length > 0 ? (
              <>
                Session jobs above are this server process only. Successful
                generates also save under{" "}
                <span className="font-semibold text-[var(--mint)]">
                  {PROVENANCE.localLibrary}
                </span>{" "}
                when storage allows — not cloud-synced.
              </>
            ) : (
              <>
                {PROVENANCE.localLibrary} · saved on this device only (not
                cloud). One photo → pick a job (Etsy spin, TikTok hook, reveal)
                → generate.
              </>
            )}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              href="/create?try=1&sample=scout"
              className="btn btn-primary text-sm"
            >
              ▶ Free sample · 10 seconds
            </Link>
            <Link href="/modules" className="btn btn-ghost text-sm">
              Toy Modules
            </Link>
            <Link
              href="/create?mode=seller-pack"
              className="btn btn-ghost text-sm"
            >
              Seller Pack · 3 outputs
            </Link>
            <Link href="/create" className="btn btn-ghost text-sm">
              Open Generate
            </Link>
          </div>
          <p className="mt-4 max-w-xs text-[10px] text-[var(--fg-dim)]">
            Clips appear here after a successful generate. Failed live jobs
            refund credits.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <SessionJobsPanel
        jobs={sessionJobs}
        cancellingId={cancellingId}
        onCancel={(id) => void cancelSessionJob(id)}
        onRefresh={() => void refreshSessionJobs()}
      />

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
          <select
            value={groupMode}
            onChange={(e) => setGroupMode(e.target.value as GroupMode)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-2 py-1.5 text-xs outline-none"
            aria-label="Group by project"
          >
            <option value="project">By project</option>
            <option value="flat">Flat list</option>
          </select>
          <span className="text-[10px] text-[var(--fg-dim)]">
            {filtered.length} / {items.length} · this browser only
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

      {grouped.map((group) => (
        <section
          key={group.key}
          className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/40 p-3 sm:p-4"
        >
          {groupMode === "project" && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                {group.input ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={group.input}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-[var(--border)]"
                  />
                ) : (
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-dashed border-[var(--border)] text-[10px] text-[var(--fg-dim)]">
                    input
                  </span>
                )}
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-[var(--fg)]">
                    {group.label}
                  </h2>
                  <p className="mt-0.5 text-[10px] text-[var(--fg-dim)]">
                    {group.items.length} version
                    {group.items.length === 1 ? "" : "s"} · Saved on this
                    device
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] font-bold uppercase text-[var(--fg-dim)]">
                Local only · not cloud-synced
              </span>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
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
                        item.demo
                          ? "bg-black/70"
                          : "bg-[var(--mint)]/80 text-black"
                      }`}
                    >
                      {resultProvenanceLabel(Boolean(item.demo))}
                    </span>
                    {item.watermark && (
                      <span className="rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white/80">
                        {PROVENANCE.onPlayerMark}
                      </span>
                    )}
                    <span className="rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white/80">
                      {item.creditStatus ??
                        (item.demo ? "0 cached" : "10 used")}
                    </span>
                    {remoteClipMayExpire(item) && (
                      <span className="rounded bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-black">
                        link aging
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold">{item.effectName}</p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--mint)]">
                    {item.status ?? "succeeded"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--fg-dim)]">
                    {new Date(item.createdAt).toLocaleString()}
                    {item.model ? ` · ${item.model.split("/").pop()}` : ""}
                    {item.duration ? ` · ${item.duration}s` : ""}
                    {item.aspectRatio ? ` · ${item.aspectRatio}` : ""}
                    {item.resolution ? ` · ${item.resolution}` : ""}
                    {item.sourceProject
                      ? ` · remix from ${item.sourceProject}`
                      : ""}
                    {item.channel ? ` · ${item.channel}` : ""}
                  </p>
                  {remoteClipMayExpire(item) && historyItemDownloadAllowed(item) && (
                    <p className="mt-1 text-[10px] text-amber-600/90">
                      Provider CDN links expire — download soon or re-generate.
                    </p>
                  )}
                  {!historyItemDownloadAllowed(item) ? (
                    <p className="mt-1 text-[10px] leading-snug text-amber-700/90 dark:text-amber-100/80">
                      Free Mini live — raw file download blocked until server
                      watermark bake (T6). Preview on-player only.
                    </p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    {historyItemDownloadAllowed(item) ? (
                      <a
                        href={
                          item.requestId
                            ? `/api/downloads/${encodeURIComponent(item.requestId)}`
                            : item.videoUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-[var(--mint)] hover:underline"
                      >
                        Open result
                      </a>
                    ) : (
                      <span
                        className="text-xs font-medium text-[var(--fg-dim)]"
                        title={historyDownloadBlockReason()}
                      >
                        Open raw blocked
                      </span>
                    )}
                    {historyItemDownloadAllowed(item) ? (
                      <button
                        type="button"
                        onClick={() => void downloadClip(item)}
                        className="text-xs font-medium text-[var(--mint)] hover:underline"
                      >
                        Download
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        title={historyDownloadBlockReason()}
                        className="cursor-not-allowed text-xs font-medium text-[var(--fg-dim)] opacity-60"
                      >
                        Download blocked
                      </button>
                    )}
                    <button
                      type="button"
                      className="text-xs text-[var(--fg-muted)] hover:text-[var(--mint)]"
                      onClick={() => {
                        if (!historyItemDownloadAllowed(item)) {
                          toast(historyDownloadBlockReason());
                          return;
                        }
                        void copyLink(item.videoUrl);
                      }}
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
                      href={
                        item.sourceProject
                          ? createRemixHref(item.effect, item.sourceProject)
                          : `/create?effect=${encodeURIComponent(item.effect)}`
                      }
                      className="text-xs text-[var(--fg-muted)] hover:text-[var(--mint)]"
                    >
                      Regenerate
                    </Link>
                    {item.sourceProject &&
                    !item.sourceProject.startsWith("lab-sample-") ? (
                      <Link
                        href={`/projects/${item.sourceProject}`}
                        className="text-xs text-[var(--fg-muted)] hover:text-[var(--mint)]"
                      >
                        Source
                      </Link>
                    ) : null}
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
        </section>
      ))}
      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-[var(--fg-dim)]">
          No saved results match this filter
        </p>
      )}
    </div>
  );
}
