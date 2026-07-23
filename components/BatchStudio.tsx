"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  historyFieldsFromSuccess,
  postGenerateWithRetry,
  sleep,
} from "@/lib/generateClient";
import { pushHistory } from "@/lib/history";
import { CATEGORIES, PRESETS, type CategoryId } from "@/lib/presets";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { isValidImageDataUrl } from "@/lib/providerError";
import { SAMPLE_TOYS, sampleToDataUrl } from "@/lib/samples";
import { fetchMe, type MeResponse } from "@/lib/meClient";
import { emitSessionRefresh } from "@/lib/sessionEvents";

type Job = {
  slug: string;
  name: string;
  status: "queued" | "running" | "done" | "error";
  error?: string;
  videoUrl?: string;
  demo?: boolean;
  model?: string;
};

/**
 * Shop-style batch: one toy photo → several presets in sequence.
 * Supports ?effects=slug1,slug2 from effect landings.
 */
export function BatchStudio({
  initialEffects,
}: {
  initialEffects?: string[];
}) {
  const validInitial = useMemo(() => {
    if (!initialEffects?.length) return null;
    return initialEffects.filter((s) => PRESETS.some((p) => p.slug === s));
  }, [initialEffects]);

  const defaults = useMemo(
    () =>
      validInitial && validInitial.length > 0
        ? validInitial
        : PRESETS.filter((p) =>
            [
              "360-spin-showcase",
              "floating-hero",
              "blind-box-unboxing",
              "display-case-glam",
            ].includes(p.slug)
          ).map((p) => p.slug),
    [validInitial]
  );

  const [image, setImage] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>(defaults);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "1:1" | "16:9">(
    "9:16"
  );
  const [duration, setDuration] = useState<5 | 10>(5);
  const [catFilter, setCatFilter] = useState<CategoryId | "all">("all");
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void fetchMe().then(setMe);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const isFree = me?.plan === "free" || me?.watermark === true;
  const demoMode = me?.mode === "demo-cached";
  /** Server free tier hard-locks 5s / 480p Mini; keep UI honest. */
  const effectiveDuration = isFree ? 5 : duration;
  const effectiveResolution = isFree ? "480p" : "720p";
  const effectiveModel = isFree ? "seedance-mini" : "seedance-fast";
  const cost = demoMode ? 0 : selected.length * CREDITS_PER_VIDEO;

  const visiblePresets = useMemo(() => {
    if (catFilter === "all") return PRESETS;
    return PRESETS.filter((p) => p.category === catFilter);
  }, [catFilter]);

  function loadFile(file: File | undefined | null) {
    if (!file?.type.startsWith("image/")) {
      setError("Upload a PNG/JPG of your toy.");
      return;
    }
    if (file.size > 8_000_000) {
      setError("Image too large (max ~8MB).");
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

  function selectCategory(id: CategoryId | "all") {
    setCatFilter(id);
    if (id === "all") return;
    const slugs = PRESETS.filter((p) => p.category === id).map((p) => p.slug);
    setSelected(slugs);
  }

  function selectSellerPack() {
    setSelected(
      PRESETS.filter((p) =>
        [
          "360-spin-showcase",
          "floating-hero",
          "blind-box-unboxing",
          "display-case-glam",
        ].includes(p.slug)
      ).map((p) => p.slug)
    );
    setCatFilter("all");
  }

  async function runBatch() {
    if (!image || !isValidImageDataUrl(image)) {
      setError("Add a toy photo first (JPEG, PNG, WebP, or GIF).");
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
        prev.map((j, idx) => (idx === i ? { ...j, status: "running" } : j))
      );
      const result = await postGenerateWithRetry(
        {
          effect: queue[i].slug,
          image,
          duration: effectiveDuration,
          aspectRatio,
          model: effectiveModel,
          resolution: effectiveResolution,
        },
        { maxRetries: 2 }
      );

      if (!result.ok) {
        setJobs((prev) =>
          prev.map((j, idx) =>
            idx === i
              ? { ...j, status: "error", error: result.error }
              : j
          )
        );
        if (result.session) {
          setMe((prev) =>
            prev
              ? { ...prev, ...result.session }
              : (result.session as MeResponse)
          );
          emitSessionRefresh();
        }
        if (result.fatal || result.paywall) {
          setError(result.error);
          // Leave remaining jobs queued so the user sees what did not run.
          break;
        }
        continue;
      }

      const data = result.data;
      if (data.session) {
        setMe((prev) =>
          prev
            ? { ...prev, ...data.session }
            : (data.session as MeResponse)
        );
      }
      pushHistory(
        historyFieldsFromSuccess(data, {
          effect: queue[i].slug,
          effectName: queue[i].name,
          fallbackDuration: effectiveDuration,
          fallbackAspect: aspectRatio,
          fallbackResolution: effectiveResolution,
        })
      );
      setJobs((prev) =>
        prev.map((j, idx) =>
          idx === i
            ? {
                ...j,
                status: "done",
                videoUrl: data.videoUrl,
                demo: data.demo,
                model: data.model,
              }
            : j
        )
      );
      emitSessionRefresh();
      // Soft gap so sequential batch stays under session/IP soft limits.
      if (i < queue.length - 1) await sleep(400);
    }
    setRunning(false);
  }

  const doneCount = jobs.filter((j) => j.status === "done").length;

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
            <img
              src={image}
              alt="toy"
              className="h-full w-full object-contain"
            />
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
        {!image && (
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TOYS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] hover:border-[var(--brand)]"
                onClick={async () => {
                  try {
                    setImage(await sampleToDataUrl(s.path));
                    setError(null);
                  } catch {
                    setError("Sample load failed");
                  }
                }}
              >
                Sample: {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] font-semibold text-[var(--fg-dim)]">
              Duration
            </p>
            <div className="mt-1 flex gap-1">
              {([5, 10] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  disabled={isFree && d === 10}
                  onClick={() => setDuration(d)}
                  className={`flex-1 rounded-lg border py-1.5 text-xs font-semibold disabled:opacity-40 ${
                    effectiveDuration === d
                      ? "border-[var(--brand)]"
                      : "border-[var(--border)] text-[var(--fg-muted)]"
                  }`}
                >
                  {d}s{isFree && d === 10 ? " · paid" : ""}
                </button>
              ))}
            </div>
            {isFree && (
              <p className="mt-1 text-[10px] text-[var(--fg-dim)]">
                Free · Mini · 480p · 5s (server-enforced)
              </p>
            )}
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[var(--fg-dim)]">
              Aspect
            </p>
            <div className="mt-1 flex gap-1">
              {(["9:16", "1:1", "16:9"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAspectRatio(a)}
                  className={`flex-1 rounded-lg border py-1.5 text-[10px] font-semibold ${
                    aspectRatio === a
                      ? "border-[var(--brand)]"
                      : "border-[var(--border)] text-[var(--fg-muted)]"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-[var(--fg-muted)]">
              Presets in this batch
            </p>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={selectSellerPack}
                className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--mint)] hover:border-[var(--mint)]"
              >
                Seller pack (4)
              </button>
              <button
                type="button"
                onClick={() => setSelected([])}
                className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--fg-dim)]"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setCatFilter("all")}
              className={`rounded-full border px-2 py-0.5 text-[10px] ${
                catFilter === "all"
                  ? "border-[var(--brand)]"
                  : "border-[var(--border)] text-[var(--fg-dim)]"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCategory(c.id)}
                className={`rounded-full border px-2 py-0.5 text-[10px] ${
                  catFilter === c.id
                    ? "border-[var(--brand)]"
                    : "border-[var(--border)] text-[var(--fg-dim)]"
                }`}
                title={c.blurb}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="mt-2 flex max-h-56 flex-wrap gap-2 overflow-y-auto">
            {visiblePresets.map((p) => {
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
          {validInitial && validInitial.length > 0 && (
            <p className="mt-2 text-[10px] text-[var(--mint)]">
              Pre-selected from tool page link ({validInitial.length} effects).
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={running || !image || selected.length === 0}
          onClick={() => void runBatch()}
          className="btn btn-primary w-full disabled:opacity-50"
        >
          {running
            ? `Batch running… ${doneCount}/${jobs.length}`
            : demoMode
              ? `Run batch · ${selected.length} clips · cached demos free`
              : `Run batch · ${selected.length} clips · ~${cost} credits · ${effectiveModel} · ${effectiveResolution}`}
        </button>
        {error && <p className="text-sm text-[var(--brand)]">{error}</p>}
        <p className="text-[11px] text-[var(--fg-dim)]">
          Sequential jobs use the same generate API
          {demoMode
            ? " (demo-cached · 0 credits)"
            : isFree
              ? " (Free Mini 480p 5s)"
              : " (paid Fast 720p path)"}
          . Finished clips land in{" "}
          <Link href="/library" className="text-[var(--brand)] hover:underline">
            Library
          </Link>
          .
        </p>
      </div>

      <div className="card space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Queue</h2>
          {jobs.length > 0 && (
            <span className="text-[10px] text-[var(--fg-dim)]">
              {doneCount} done
            </span>
          )}
        </div>
        {jobs.length === 0 && (
          <p className="text-sm text-[var(--fg-dim)]">
            No jobs yet. Pick presets (or open Batch from an effect page) and
            run.
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
              <video
                src={j.videoUrl}
                controls
                muted
                playsInline
                className="mt-2 max-h-40 w-full rounded-lg bg-black/40"
              />
            )}
            {j.status === "done" && (
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {j.demo && (
                  <span className="text-[10px] font-bold uppercase text-[var(--fg-dim)]">
                    cached demo
                  </span>
                )}
                {j.model && (
                  <span className="text-[10px] text-[var(--fg-dim)]">
                    {j.model.split("/").pop()}
                  </span>
                )}
                <Link
                  href={`/effects/${j.slug}`}
                  className="text-[10px] text-[var(--mint)] hover:underline"
                >
                  Effect page →
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
