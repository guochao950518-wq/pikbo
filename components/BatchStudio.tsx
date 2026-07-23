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
  aspectRatio?: "9:16" | "1:1" | "16:9";
};

/** SELLER_PACK PRD v1 — three fixed outputs, not arbitrary batch. */
export const SELLER_PACK_ITEMS = [
  {
    key: "listing_spin",
    slug: "360-spin-showcase",
    label: "Listing Spin",
    channel: "Marketplace gallery",
    aspectRatio: "1:1" as const,
  },
  {
    key: "blind_box_reveal",
    slug: "blind-box-unboxing",
    label: "Blind-box Reveal",
    channel: "Launch / restock",
    aspectRatio: "9:16" as const,
  },
  {
    key: "social_flash",
    slug: "paparazzi-flash",
    label: "Social Flash",
    channel: "TikTok / Reels / Shorts",
    aspectRatio: "9:16" as const,
  },
] as const;

export const SELLER_PACK_SLUGS = SELLER_PACK_ITEMS.map((i) => i.slug);

function selectedMatchesSellerPack(slugs: string[]): boolean {
  if (slugs.length !== SELLER_PACK_SLUGS.length) return false;
  const set = new Set(slugs);
  return SELLER_PACK_SLUGS.every((s) => set.has(s));
}

/**
 * Shop-style batch: one toy photo → several presets in sequence.
 * Supports ?effects=slug1,slug2 and ?pack=seller (Seller Pack MVP).
 */
export function BatchStudio({
  initialEffects,
  pack,
}: {
  initialEffects?: string[];
  /** Named pack from SELLER_PACK PRD — freezes the three seller outputs. */
  pack?: "seller" | string;
}) {
  const isSellerPack = pack === "seller";

  const validInitial = useMemo(() => {
    if (isSellerPack) return [...SELLER_PACK_SLUGS];
    if (!initialEffects?.length) return null;
    return initialEffects.filter((s) => PRESETS.some((p) => p.slug === s));
  }, [initialEffects, isSellerPack]);

  const defaults = useMemo(
    () =>
      validInitial && validInitial.length > 0
        ? validInitial
        : PRESETS.filter((p) =>
            [
              "360-spin-showcase",
              "blind-box-unboxing",
              "paparazzi-flash",
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
  const [ownsRights, setOwnsRights] = useState(false);

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
  /** Label only when the frozen trio is selected (PRD: custom batch loses Seller Pack name). */
  const sellerPackActive = selectedMatchesSellerPack(selected);

  const visiblePresets = useMemo(() => {
    if (sellerPackActive) {
      return SELLER_PACK_SLUGS.map(
        (slug) => PRESETS.find((p) => p.slug === slug)!
      ).filter(Boolean);
    }
    if (catFilter === "all") return PRESETS;
    return PRESETS.filter((p) => p.category === catFilter);
  }, [catFilter, sellerPackActive]);

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
    setSelected([...SELLER_PACK_SLUGS]);
    setCatFilter("all");
  }

  function aspectForSlug(slug: string): "9:16" | "1:1" | "16:9" {
    if (sellerPackActive) {
      const item = SELLER_PACK_ITEMS.find((i) => i.slug === slug);
      if (item) return item.aspectRatio;
    }
    return aspectRatio;
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
    if (!ownsRights) {
      setError("Confirm you own this photo before running the batch.");
      return;
    }

    setError(null);
    setRunning(true);
    const queue: Job[] = selected.map((slug) => {
      const p = PRESETS.find((x) => x.slug === slug)!;
      const packItem = SELLER_PACK_ITEMS.find((i) => i.slug === slug);
      return {
        slug,
        name: sellerPackActive && packItem ? packItem.label : p.name,
        status: "queued" as const,
        aspectRatio: aspectForSlug(slug),
      };
    });
    setJobs(queue);

    for (let i = 0; i < queue.length; i++) {
      setJobs((prev) =>
        prev.map((j, idx) => (idx === i ? { ...j, status: "running" } : j))
      );
      const jobAspect = queue[i].aspectRatio ?? aspectRatio;
      const result = await postGenerateWithRetry(
        {
          effect: queue[i].slug,
          image,
          duration: effectiveDuration,
          aspectRatio: jobAspect,
          model: effectiveModel,
          resolution: effectiveResolution,
          ownsRights: true,
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
          fallbackAspect: jobAspect,
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
        {sellerPackActive && (
          <div className="rounded-xl border border-[var(--mint)]/30 bg-[var(--mint)]/[0.06] px-3 py-2.5 text-xs text-[var(--fg-muted)]">
            <p className="font-bold text-[var(--mint)]">
              Seller Pack · 3 outputs
            </p>
            <p className="mt-1 leading-relaxed">
              Listing Spin (1:1) · Blind-box Reveal (9:16) · Social Flash (9:16).
              {demoMode
                ? " Cached demos · 0 credits · upload not rendered."
                : ` Live quote ${selected.length * CREDITS_PER_VIDEO} credits · failed children refund.`}
            </p>
            <ul className="mt-2 space-y-0.5 text-[10px] text-[var(--fg-dim)]">
              {SELLER_PACK_ITEMS.map((item) => (
                <li key={item.key}>
                  {item.label} → {item.channel}
                </li>
              ))}
            </ul>
          </div>
        )}
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
                className={`rounded-md border px-2 py-0.5 text-[10px] ${
                  sellerPackActive
                    ? "border-[var(--mint)] bg-[var(--mint)]/10 text-[var(--mint)]"
                    : "border-[var(--border)] text-[var(--mint)] hover:border-[var(--mint)]"
                }`}
              >
                Seller Pack · 3
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

        <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-[11px] leading-snug text-[var(--fg-muted)]">
          <input
            type="checkbox"
            checked={ownsRights}
            onChange={(e) => setOwnsRights(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[var(--mint)]"
          />
          <span>
            I own this photo and have the right to animate and publish this toy
            for every preset in the batch.
          </span>
        </label>

        <button
          type="button"
          disabled={running || !image || selected.length === 0 || !ownsRights}
          onClick={() => void runBatch()}
          className="btn btn-primary w-full disabled:opacity-50"
        >
          {running
            ? `${sellerPackActive ? "Seller Pack" : "Batch"} running… ${doneCount}/${jobs.length}`
            : demoMode
              ? `${sellerPackActive ? "Preview Seller Pack" : "Run batch"} · ${selected.length} · cached demos free`
              : `${sellerPackActive ? "Run Seller Pack" : "Run batch"} · ${selected.length} · ${cost} credits`}
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
                <span
                  className={`text-[10px] font-bold uppercase ${
                    j.demo ? "text-[var(--fg-dim)]" : "text-[var(--mint)]"
                  }`}
                >
                  {j.demo ? "Cached demo" : "Live generation"}
                </span>
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
