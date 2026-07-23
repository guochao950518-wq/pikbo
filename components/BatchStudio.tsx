"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  historyFieldsFromSuccess,
  postGenerateWithRetry,
  releaseSellerPackChildClient,
  reserveSellerPackShadowClient,
  settleSellerPackChildClient,
  sleep,
} from "@/lib/generateClient";
import { registerLocalAsset } from "@/lib/clientAssets";
import { pushHistory } from "@/lib/history";
import { CATEGORIES, PRESETS, type CategoryId } from "@/lib/presets";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { isValidImageDataUrl } from "@/lib/providerError";
import { SAMPLE_TOYS, sampleToDataUrl } from "@/lib/samples";
import { fetchMe, type MeResponse } from "@/lib/meClient";
import { emitSessionRefresh } from "@/lib/sessionEvents";
import {
  canExportSellerPack,
  sellerPackCsv,
  sellerPackManifest,
  type SellerPackExportItem,
} from "@/lib/sellerPackExport";
import { canDownloadResult } from "@/lib/createTrust";

type Job = {
  slug: string;
  name: string;
  status:
    | "queued"
    | "running"
    | "succeeded"
    | "failed"
    | "refunded"
    | "not_started";
  error?: string;
  errorCode?: string;
  videoUrl?: string;
  demo?: boolean;
  model?: string;
  aspectRatio?: "9:16" | "1:1" | "16:9";
  duration?: number;
  resolution?: string;
  watermark?: boolean;
  creditState?:
    | "0 cached"
    | "10 used"
    | "10 restored"
    | "refund unconfirmed"
    | "not charged";
  requestId?: string;
  retryCount: number;
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
  const [runProjectId, setRunProjectId] = useState<string | null>(null);

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
  const sellerPackActive = isSellerPack || selectedMatchesSellerPack(selected);

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
    if (isSellerPack) return;
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function selectCategory(id: CategoryId | "all") {
    if (isSellerPack) return;
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

  async function executeJob(
    job: Job,
    projectId: string,
    packReservationId?: string | null,
    /** Phase D: shared still asset — avoids re-posting multi-MB Base64 per child */
    sharedAssetId?: string | null
  ): Promise<{ job: Job; stopQueue: boolean }> {
    const jobAspect = job.aspectRatio ?? aspectRatio;
    const result = await postGenerateWithRetry(
      {
        effect: job.slug,
        // Prefer assetId when registered; fall back to data URL for samples.
        ...(sharedAssetId
          ? { assetId: sharedAssetId }
          : { image: image ?? undefined }),
        duration: effectiveDuration,
        aspectRatio: jobAspect,
        model: effectiveModel,
        resolution: effectiveResolution,
        ownsRights: true,
      },
      { maxRetries: 1 }
    );

    if (!result.ok) {
      if (result.session) {
        setMe((previous) =>
          previous
            ? { ...previous, ...result.session }
            : (result.session as MeResponse)
        );
        emitSessionRefresh();
      }
      const refunded = result.creditsRefunded === true;
      const ambiguous = result.status === 0;
      // Phase C: release 10 from Seller Pack shadow reservation on failed child.
      // Failures only occur on the live debit path (demo never debits).
      if (packReservationId) {
        void releaseSellerPackChildClient({
          reservationId: packReservationId,
          childKey: job.slug,
          reason: refunded ? "refunded" : "failed",
        });
      }
      return {
        job: {
          ...job,
          status: refunded ? "refunded" : "failed",
          error: result.error,
          errorCode: result.code,
          creditState: refunded
            ? "10 restored"
            : ambiguous
              ? "refund unconfirmed"
              : "not charged",
        },
        stopQueue: result.fatal || result.paywall || ambiguous,
      };
    }

    const data = result.data;
    if (data.session) {
      setMe((previous) =>
        previous
          ? { ...previous, ...data.session }
          : (data.session as MeResponse)
      );
    }
    // Settle 10 on shadow pack when live child succeeds (demo = 0, no settle).
    if (packReservationId && !data.demo) {
      void settleSellerPackChildClient({
        reservationId: packReservationId,
        jobId:
          typeof data.requestId === "string" ? data.requestId : undefined,
        childKey: job.slug,
      });
    }
    pushHistory(
      historyFieldsFromSuccess(data, {
        effect: job.slug,
        effectName: job.name,
        fallbackDuration: effectiveDuration,
        fallbackAspect: jobAspect,
        fallbackResolution: effectiveResolution,
        projectId,
        projectName: sellerPackActive
          ? "Seller Pack · 3 outputs"
          : "Custom batch",
        inputImage:
          image && image.length <= 300_000 ? image : undefined,
        channel: SELLER_PACK_ITEMS.find((item) => item.slug === job.slug)
          ?.channel,
      })
    );
    emitSessionRefresh();
    return {
      job: {
        ...job,
        status: "succeeded",
        videoUrl: data.videoUrl,
        demo: data.demo,
        model: data.model,
        duration:
          typeof data.duration === "number"
            ? data.duration
            : effectiveDuration,
        resolution:
          typeof data.resolution === "string"
            ? data.resolution
            : effectiveResolution,
        aspectRatio:
          data.aspectRatio === "1:1" ||
          data.aspectRatio === "16:9" ||
          data.aspectRatio === "9:16"
            ? data.aspectRatio
            : jobAspect,
        watermark: Boolean(data.watermark),
        creditState: data.demo ? "0 cached" : "10 used",
        requestId:
          typeof data.requestId === "string" ? data.requestId : undefined,
      },
      stopQueue: false,
    };
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
    const projectId = `${sellerPackActive ? "seller-pack" : "batch"}-${Date.now()}`;
    setRunProjectId(projectId);

    // Phase C: Seller Pack shadow-reserves 30 (or N×10) when durable is on.
    // Cookie still debits per child; DURABLE_OFF is non-fatal.
    let packReservationId: string | null = null;
    if (sellerPackActive && !demoMode) {
      const reserved = await reserveSellerPackShadowClient({
        childCount: selected.length,
        idempotencyKey: `ui-pack:${projectId}`,
      });
      if (reserved.ok && reserved.reservationId) {
        packReservationId = reserved.reservationId;
      } else if (reserved.code === "INSUFFICIENT_CREDITS") {
        // Shadow wallet empty — still allow cookie path; surface honesty only.
        setError(
          (reserved.error ||
            "Durable shadow wallet short — continuing with cookie credits only") +
            " · cookie generate remains authoritative"
        );
      }
    }

    // Phase D: register still once — Seller Pack / batch children reuse assetId.
    let sharedAssetId: string | null = null;
    if (image && image.startsWith("data:image")) {
      const reg = await registerLocalAsset(image);
      if (reg?.assetId) sharedAssetId = reg.assetId;
    }

    const queue: Job[] = selected.map((slug) => {
      const p = PRESETS.find((x) => x.slug === slug)!;
      const packItem = SELLER_PACK_ITEMS.find((i) => i.slug === slug);
      return {
        slug,
        name: sellerPackActive && packItem ? packItem.label : p.name,
        status: "queued" as const,
        aspectRatio: aspectForSlug(slug),
        retryCount: 0,
      };
    });
    setJobs(queue);

    for (let i = 0; i < queue.length; i++) {
      setJobs((prev) =>
        prev.map((j, idx) => (idx === i ? { ...j, status: "running" } : j))
      );
      const outcome = await executeJob(
        queue[i],
        projectId,
        packReservationId,
        sharedAssetId
      );
      queue[i] = outcome.job;
      setJobs((previous) =>
        previous.map((job, index) => (index === i ? outcome.job : job))
      );
      if (outcome.stopQueue) {
        setError(outcome.job.error ?? "Seller Pack paused");
        setJobs((previous) =>
          previous.map((job, index) =>
            index > i && job.status === "queued"
              ? { ...job, status: "not_started" }
              : job
          )
        );
        // Release remaining shadow hold for children that never ran.
        if (packReservationId) {
          for (let j = i + 1; j < queue.length; j++) {
            void releaseSellerPackChildClient({
              reservationId: packReservationId,
              childKey: queue[j].slug,
              reason: "not_started",
            });
          }
        }
        break;
      }
      // Soft gap so sequential batch stays under session/IP soft limits.
      if (i < queue.length - 1) await sleep(400);
    }
    setRunning(false);
  }

  async function retryJob(slug: string) {
    if (running || !image || !ownsRights) return;
    const target = jobs.find((job) => job.slug === slug);
    if (
      !target ||
      (target.status !== "failed" && target.status !== "refunded")
    ) {
      return;
    }
    const projectId =
      runProjectId ??
      `${sellerPackActive ? "seller-pack" : "batch"}-retry-${target.slug}`;
    setRunProjectId(projectId);
    setRunning(true);
    setError(null);
    let sharedAssetId: string | null = null;
    if (image.startsWith("data:image")) {
      const reg = await registerLocalAsset(image);
      if (reg?.assetId) sharedAssetId = reg.assetId;
    }
    const retrying: Job = {
      ...target,
      status: "running",
      error: undefined,
      errorCode: undefined,
      creditState: undefined,
      retryCount: target.retryCount + 1,
    };
    setJobs((previous) =>
      previous.map((job) => (job.slug === slug ? retrying : job))
    );
    const outcome = await executeJob(
      retrying,
      projectId,
      null,
      sharedAssetId
    );
    setJobs((previous) =>
      previous.map((job) => (job.slug === slug ? outcome.job : job))
    );
    if (!outcome.job.videoUrl) {
      setError(outcome.job.error ?? "Retry failed");
    }
    setRunning(false);
  }

  const doneCount = jobs.filter((j) => j.status === "succeeded").length;
  const needsAttentionCount = jobs.filter(
    (job) =>
      job.status === "failed" ||
      job.status === "refunded" ||
      job.status === "not_started"
  ).length;

  const exportItems: SellerPackExportItem[] = useMemo(() => {
    return jobs.map((j) => {
      const packMeta = SELLER_PACK_ITEMS.find((p) => p.slug === j.slug);
      return {
        key: packMeta?.key || j.slug,
        slug: j.slug,
        label: packMeta?.label || j.name,
        status: j.status,
        videoUrl: j.videoUrl,
        demo: j.demo,
        watermark: j.watermark,
        creditState: j.creditState,
        downloadable: Boolean(
          j.videoUrl &&
            canDownloadResult({
              demo: Boolean(j.demo),
              watermark: Boolean(j.watermark),
            })
        ),
      };
    });
  }, [jobs]);
  const canExportPack = canExportSellerPack(exportItems);

  function downloadText(filename: string, body: string, mime: string) {
    const blob = new Blob([body], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportAvailableCsv() {
    const csv = sellerPackCsv(exportItems);
    if (!csv) return;
    downloadText(
      `pikbo-seller-pack-${Date.now()}.csv`,
      csv,
      "text/csv;charset=utf-8"
    );
  }

  function exportAvailableManifest() {
    const manifest = sellerPackManifest(exportItems);
    downloadText(
      `pikbo-seller-pack-manifest-${Date.now()}.json`,
      JSON.stringify(manifest, null, 2),
      "application/json"
    );
  }
  const liveQuoteCovered =
    demoMode ||
    me?.credits === undefined ||
    me.credits >= cost;
  const canRun =
    !running &&
    Boolean(image) &&
    selected.length > 0 &&
    ownsRights &&
    liveQuoteCovered;

  const primaryBatchLabel = running
    ? `${sellerPackActive ? "Seller Pack" : "Batch"} running… ${doneCount}/${jobs.length}`
    : !image
      ? "Add a toy photo first"
      : !ownsRights
        ? "Confirm ownership to continue"
        : demoMode
          ? `${sellerPackActive ? "Preview Seller Pack" : "Run batch"} · ${selected.length} · cached free`
          : `${sellerPackActive ? "Run Seller Pack" : "Run batch"} · ${selected.length} · ${cost} credits`;

  return (
    <div className="mt-8 grid gap-6 pb-36 lg:grid-cols-[1fr_1.1fr] lg:pb-0">
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
                : ` Live quote ${selected.length * CREDITS_PER_VIDEO} credits · only a returned post-debit failure is marked restored.`}
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

        <div className={`grid gap-2 ${isSellerPack ? "" : "grid-cols-2"}`}>
          {!isSellerPack ? (
            <>
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
            </>
          ) : (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-3 text-xs text-[var(--fg-muted)]">
              Per-output formats are fixed: Listing Spin uses 1:1; Reveal and
              Social Flash use 9:16. All three use the current 5s plan path.
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-[var(--fg-muted)]">
              Presets in this batch
            </p>
            {!isSellerPack ? (
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
            ) : (
              <span className="rounded-full border border-[var(--mint)]/30 bg-[var(--mint)]/10 px-2.5 py-1 text-[10px] font-bold text-[var(--mint)]">
                Frozen v1 configuration
              </span>
            )}
          </div>
          {!isSellerPack ? (
            <>
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
            </>
          ) : (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {SELLER_PACK_ITEMS.map((item, index) => (
                <article
                  key={item.key}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-3"
                >
                  <span className="text-[10px] font-black text-[var(--mint)]">
                    0{index + 1}
                  </span>
                  <p className="mt-1 text-xs font-bold">{item.label}</p>
                  <p className="mt-1 text-[10px] text-[var(--fg-dim)]">
                    {item.aspectRatio} · 5s · {item.channel}
                  </p>
                  <p className="mt-2 text-[10px] font-semibold text-[var(--fg-muted)]">
                    {demoMode ? "0 cached" : "10 credits"}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

        <label
          id="batch-ownership"
          className="flex cursor-pointer items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-[11px] leading-snug text-[var(--fg-muted)]"
        >
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
          disabled={!canRun}
          onClick={() => void runBatch()}
          className="btn btn-primary hidden w-full disabled:opacity-50 lg:flex"
        >
          {primaryBatchLabel}
        </button>
        {!liveQuoteCovered && sellerPackActive ? (
          <div className="rounded-xl border border-amber-300/25 bg-amber-300/[0.06] p-3 text-xs text-amber-100">
            <p className="font-bold">
              Full live pack needs {cost} credits; this session has{" "}
              {me?.credits ?? 0}.
            </p>
            <p className="mt-1 text-[11px] text-white/50">
              The current Free allowance supports one Mini job. Choose one
              recipe in single Generate; paid activation remains gated.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SELLER_PACK_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  href={`/create?effect=${item.slug}`}
                  className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-bold text-white/70"
                >
                  Try {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
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
          <div>
            <h2 className="font-semibold">
              {sellerPackActive ? "Seller Pack queue" : "Queue"}
            </h2>
            {jobs.length > 0 ? (
              <p className="mt-0.5 text-[10px] text-[var(--fg-dim)]">
                {doneCount} ready
                {needsAttentionCount > 0
                  ? ` · ${needsAttentionCount} need attention`
                  : ""}
              </p>
            ) : null}
          </div>
          {jobs.length > 0 && (
            <span className="text-[10px] text-[var(--fg-dim)]">
              Saved on this device
            </span>
          )}
        </div>
        {jobs.length === 0 && (
          <p className="text-sm text-[var(--fg-dim)]">
            No jobs yet. Pick presets (or open Batch from an effect page) and
            run.
          </p>
        )}
        {jobs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] bg-black/30 px-3 py-2">
            <p className="text-[11px] text-[var(--fg-muted)]">
              Export only succeeded downloadable clips
              {canExportPack
                ? ` · ${
                    exportItems.filter(
                      (i) => i.downloadable && i.status === "succeeded"
                    ).length
                  } available`
                : " · none ready yet"}
            </p>
            <button
              type="button"
              disabled={!canExportPack}
              onClick={exportAvailableCsv}
              className="rounded-full border border-[var(--mint)]/30 px-3 py-1 text-[10px] font-bold text-[var(--mint)] disabled:opacity-40"
            >
              Export CSV
            </button>
            <button
              type="button"
              disabled={!canExportPack}
              onClick={exportAvailableManifest}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] font-bold text-[var(--fg-muted)] disabled:opacity-40"
            >
              Manifest JSON
            </button>
            <span className="text-[10px] text-[var(--fg-dim)]">
              No ZIP until storage · failures omitted
            </span>
          </div>
        )}
        {/* Delivery pack — value only when clips leave the device */}
        {sellerPackActive && doneCount > 0 && (
          <div className="rounded-xl border border-[var(--mint)]/25 bg-[var(--mint)]/[0.06] px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--mint)]">
              Delivery pack · {doneCount}/3 ready
            </p>
            <ul className="mt-1.5 space-y-1 text-[11px] text-[var(--fg-muted)]">
              <li>○ Download each succeeded clip (or open Library)</li>
              <li>○ Listing Spin → shop gallery (1:1) · verify sculpt</li>
              <li>○ Blind-box Reveal → drop / restock story (9:16)</li>
              <li>○ Social Flash → TikTok / Reels first second (9:16)</li>
              <li>
                ○{" "}
                <Link href="/library" className="text-[var(--mint)] hover:underline">
                  Library
                </Link>{" "}
                keeps this device set ·{" "}
                <Link href="/create" className="text-[var(--mint)] hover:underline">
                  single Generate
                </Link>{" "}
                for one more variant
              </li>
            </ul>
          </div>
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
                  j.status === "succeeded"
                    ? "text-[var(--mint)]"
                    : j.status === "failed" || j.status === "refunded"
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
            <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] text-[var(--fg-dim)]">
              <span>{j.aspectRatio ?? aspectRatio}</span>
              <span>· {j.duration ?? effectiveDuration}s</span>
              <span>· {j.resolution ?? effectiveResolution}</span>
              {j.creditState ? (
                <span
                  className={
                    j.creditState === "refund unconfirmed"
                      ? "font-bold text-amber-300"
                      : "font-bold text-[var(--fg-muted)]"
                  }
                >
                  · {j.creditState}
                </span>
              ) : null}
            </div>
            {j.videoUrl && (
              <video
                src={j.videoUrl}
                controls
                muted
                playsInline
                className="mt-2 max-h-40 w-full rounded-lg bg-black/40"
              />
            )}
            {j.status === "succeeded" && (
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
                {j.demo || !j.watermark ? (
                  <a
                    href={
                      j.requestId
                        ? `/api/downloads/${encodeURIComponent(j.requestId)}`
                        : j.videoUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-[var(--mint)] hover:underline"
                  >
                    Download / open
                  </a>
                ) : (
                  <span
                    className="text-[10px] text-amber-100/80"
                    title="Free Mini live clips cannot download the raw provider file until server watermark bake ships."
                  >
                    Download blocked · Free raw
                  </span>
                )}
              </div>
            )}
            {(j.status === "failed" || j.status === "refunded") && (
              <button
                type="button"
                disabled={running || !image || !ownsRights}
                onClick={() => void retryJob(j.slug)}
                className="mt-2 rounded-full border border-[var(--mint)]/30 px-3 py-1 text-[10px] font-bold text-[var(--mint)] disabled:opacity-40"
              >
                Retry this item · new 10-credit quote
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Phase F: sticky mobile Seller Pack / Batch CTA above tab nav */}
      <div className="fixed inset-x-0 bottom-[4.75rem] z-40 border-t border-white/10 bg-black/90 px-4 py-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        {image && !ownsRights ? (
          <label className="mb-2 flex cursor-pointer items-start gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2 text-[10px] leading-snug text-[var(--fg-muted)]">
            <input
              type="checkbox"
              checked={ownsRights}
              onChange={(e) => setOwnsRights(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--mint)]"
            />
            <span>I own this photo for every pack child.</span>
          </label>
        ) : null}
        <button
          type="button"
          disabled={running || (Boolean(image) && !canRun)}
          onClick={() => {
            if (!image) {
              window.scrollTo({ top: 0, behavior: "smooth" });
              return;
            }
            if (!ownsRights) {
              document
                .getElementById("batch-ownership")
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
              return;
            }
            if (canRun) void runBatch();
          }}
          className="btn btn-primary w-full py-3 text-sm disabled:opacity-50"
        >
          {primaryBatchLabel}
        </button>
      </div>
    </div>
  );
}
