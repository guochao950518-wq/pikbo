"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PRESETS } from "@/lib/presets";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { pushHistory } from "@/lib/history";

type Job = {
  slug: string;
  name: string;
  status: "queued" | "running" | "done" | "error";
  error?: string;
  videoUrl?: string;
};

/**
 * Shop-style batch: one toy photo → several presets in sequence.
 * Uses same /api/generate as single Generate.
 */
export function BatchStudio() {
  const defaults = useMemo(
    () =>
      PRESETS.filter((p) =>
        ["360-spin-showcase", "floating-hero", "blind-box-unboxing", "display-case-glam"].includes(
          p.slug
        )
      ).map((p) => p.slug),
    []
  );

  const [image, setImage] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>(defaults);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cost = selected.length * CREDITS_PER_VIDEO;

  function loadFile(file: File | undefined | null) {
    if (!file?.type.startsWith("image/")) {
      setError("Upload a PNG/JPG of your toy.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  function toggle(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function runBatch() {
    if (!image) {
      setError("Add a toy photo first.");
      return;
    }
    if (selected.length === 0) {
      setError("Pick at least one preset.");
      return;
    }

    setError(null);
    setRunning(true);
    const queue: Job[] = selected.map((slug) => {
      const p = PRESETS.find((x) => x.slug === slug)!;
      return { slug, name: p.name, status: "queued" };
    });
    setJobs(queue);

    for (let i = 0; i < queue.length; i++) {
      setJobs((prev) =>
        prev.map((j, idx) =>
          idx === i ? { ...j, status: "running" } : j
        )
      );
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            effect: queue[i].slug,
            image,
            duration: 5,
            aspectRatio: "9:16",
            model: "seedance-fast",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        pushHistory({
          videoUrl: data.videoUrl,
          effect: queue[i].slug,
          effectName: queue[i].name,
          model: data.model,
          watermark: data.watermark,
          demo: data.demo,
        });
        setJobs((prev) =>
          prev.map((j, idx) =>
            idx === i
              ? { ...j, status: "done", videoUrl: data.videoUrl }
              : j
          )
        );
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Error";
        setJobs((prev) =>
          prev.map((j, idx) =>
            idx === i ? { ...j, status: "error", error: msg } : j
          )
        );
        if (msg.includes("credits") || msg.includes("Credits")) {
          setError(msg);
          break;
        }
      }
    }
    setRunning(false);
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-4">
        <label
          className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            loadFile(e.dataTransfer.files?.[0]);
          }}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="toy" className="h-full w-full object-contain" />
          ) : (
            <span className="px-4 text-center text-sm text-[var(--fg-dim)]">
              🧸 Drop one toy photo for the whole batch
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => loadFile(e.target.files?.[0])}
          />
        </label>

        <div>
          <p className="text-xs font-semibold text-[var(--fg-muted)]">
            Presets in this batch
          </p>
          <div className="mt-2 flex max-h-56 flex-wrap gap-2 overflow-y-auto">
            {PRESETS.map((p) => {
              const on = selected.includes(p.slug);
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => toggle(p.slug)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs ${
                    on
                      ? "border-[var(--brand)] bg-[var(--grad-soft)]"
                      : "border-[var(--border)] text-[var(--fg-muted)]"
                  }`}
                >
                  {p.emoji} {p.name}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          disabled={running || !image || selected.length === 0}
          onClick={runBatch}
          className="btn btn-primary w-full disabled:opacity-50"
        >
          {running
            ? "Batch running…"
            : `Run batch · ${selected.length} clips · ~${cost} credits`}
        </button>
        {error && <p className="text-sm text-[var(--brand)]">{error}</p>}
        <p className="text-[11px] text-[var(--fg-dim)]">
          Sequential jobs use the same generate API. Finished clips also land in{" "}
          <Link href="/library" className="text-[var(--brand)] hover:underline">
            Library
          </Link>
          .
        </p>
      </div>

      <div className="card space-y-3 p-4">
        <h2 className="font-semibold">Queue</h2>
        {jobs.length === 0 && (
          <p className="text-sm text-[var(--fg-dim)]">
            No jobs yet. Pick presets and run.
          </p>
        )}
        {jobs.map((j) => (
          <div
            key={j.slug}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-3"
          >
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-medium">{j.name}</span>
              <span
                className={`text-[10px] font-bold uppercase ${
                  j.status === "done"
                    ? "text-[var(--mint)]"
                    : j.status === "error"
                      ? "text-[var(--brand)]"
                      : j.status === "running"
                        ? "text-[var(--brand-2)]"
                        : "text-[var(--fg-dim)]"
                }`}
              >
                {j.status}
              </span>
            </div>
            {j.error && (
              <p className="mt-1 text-xs text-[var(--brand)]">{j.error}</p>
            )}
            {j.videoUrl && (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={j.videoUrl}
                controls
                muted
                playsInline
                className="mt-2 max-h-40 w-full rounded-lg bg-black/40"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
