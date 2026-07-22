"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  createGeneration,
  GenerationApiError,
  retryGeneration,
  uploadGenerationAssets,
  waitForGeneration,
  type GenerationAsset,
  type GenerationRequest,
  type GenerationResponse,
} from "@/components/studio/generation-client";
import {
  ToyAssetGrid,
  type ToyAssetDraft,
} from "@/components/studio/ToyAssetGrid";
import { track } from "@/lib/analytics";
import { pushHistory } from "@/lib/history";
import { CATEGORIES, PRESETS, type CategoryId } from "@/lib/presets";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { SAMPLE_TOYS, sampleToDataUrl } from "@/lib/samples";

type AspectRatio = GenerationRequest["aspectRatio"];
type AssetMap = Partial<Record<ToyAssetDraft["role"], ToyAssetDraft>>;
type CampaignJobStatus =
  | "queued"
  | "submitting"
  | "running"
  | "succeeded"
  | "validation"
  | "failed"
  | "canceled";

type CampaignJob = {
  localId: string;
  presetId: string;
  presetName: string;
  aspectRatio: AspectRatio;
  status: CampaignJobStatus;
  progress: number;
  jobId?: string;
  videoUrl?: string;
  demo?: boolean;
  validationMode?: boolean;
  error?: string;
};

const DEFAULT_PRESETS = [
  "360-spin-showcase",
  "floating-hero",
  "blind-box-unboxing",
  "display-case-glam",
];

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}
export function BatchStudio({ initialEffects }: { initialEffects?: string[] }) {
  const defaultPresets = useMemo(
    () => {
      const requested = (initialEffects ?? []).filter((slug) =>
        PRESETS.some((preset) => preset.slug === slug)
      );
      if (requested.length > 0) return [...new Set(requested)];
      return PRESETS.filter((preset) => DEFAULT_PRESETS.includes(preset.slug)).map(
        (preset) => preset.slug
      );
    },
    [initialEffects]
  );
  const [campaignName, setCampaignName] = useState("New toy launch");
  const [sku, setSku] = useState("");
  const [assets, setAssets] = useState<AssetMap>({});
  const [selectedPresets, setSelectedPresets] = useState(defaultPresets);
  const [selectedRatios, setSelectedRatios] = useState<AspectRatio[]>(["9:16"]);
  const [jobs, setJobs] = useState<CampaignJob[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<5 | 10>(5);
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | "all">("all");
  const abortControllers = useRef(new Map<string, AbortController>());
  const uploadedAssetsPromise = useRef<Promise<GenerationAsset[]> | null>(null);

  const plannedCount = selectedPresets.length * selectedRatios.length;
  const estimatedCredits = plannedCount * CREDITS_PER_VIDEO;
  const failedJobs = jobs.filter((job) => job.status === "failed");
  const succeededJobs = jobs.filter((job) => job.status === "succeeded");
  const validationJobs = jobs.filter((job) => job.status === "validation");
  const activeJobs = jobs.filter((job) =>
    ["queued", "submitting", "running"].includes(job.status)
  );
  const visiblePresets = useMemo(
    () =>
      categoryFilter === "all"
        ? PRESETS
        : PRESETS.filter((preset) => preset.category === categoryFilter),
    [categoryFilter]
  );

  function updateJob(localId: string, patch: Partial<CampaignJob>) {
    setJobs((current) =>
      current.map((job) => (job.localId === localId ? { ...job, ...patch } : job))
    );
  }

  function togglePreset(slug: string) {
    const adding = !selectedPresets.includes(slug);
    if (adding) {
      track("template_select", { preset_id: slug, source: "sku_campaign" });
    }
    setSelectedPresets((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug]
    );
  }

  function toggleRatio(ratio: AspectRatio) {
    setSelectedRatios((current) =>
      current.includes(ratio)
        ? current.filter((item) => item !== ratio)
        : [...current, ratio]
    );
  }

  function requestFor(job: CampaignJob): GenerationRequest {
    return {
      presetId: job.presetId,
      assets: Object.values(assets).map((asset) => ({
        role: asset.role,
        dataUrl: asset.dataUrl,
      })),
      purpose: "sku-campaign",
      aspectRatio: job.aspectRatio,
      duration,
      modelId: "seedance-fast",
      resolution: "480p",
    };
  }

  function applyJobResponse(localId: string, response: GenerationResponse) {
    const status: CampaignJobStatus =
      response.job.status === "succeeded"
        ? response.validationMode
          ? "validation"
          : "succeeded"
        : response.job.status === "failed"
          ? "failed"
          : response.job.status === "canceled"
            ? "canceled"
            : response.job.status;
    updateJob(localId, {
      jobId: response.job.id,
      status,
      progress: response.job.progress,
      videoUrl: response.job.outputUrl,
      demo: response.job.demo,
      validationMode: response.validationMode,
      error: response.job.error,
    });
  }

  async function createCampaignGeneration(item: CampaignJob) {
    const request = requestFor(item);
    try {
      return await createGeneration(request);
    } catch (caught) {
      if (
        caught instanceof GenerationApiError &&
        caught.code === "live_assets_must_be_uploaded"
      ) {
        uploadedAssetsPromise.current ??= uploadGenerationAssets(
          Object.values(assets)
        );
        try {
          const uploadedAssets = await uploadedAssetsPromise.current;
          return createGeneration({ ...request, assets: uploadedAssets });
        } catch (uploadError) {
          uploadedAssetsPromise.current = null;
          throw uploadError;
        }
      }
      throw caught;
    }
  }

  async function executeJob(item: CampaignJob) {
    const controller = new AbortController();
    abortControllers.current.set(item.localId, controller);
    updateJob(item.localId, {
      status: "submitting",
      progress: 0,
      error: undefined,
      videoUrl: undefined,
    });
    track("generation_start", {
      preset_id: item.presetId,
      aspect_ratio: item.aspectRatio,
      source: "sku_campaign",
      retry: Boolean(item.jobId),
    });
    try {
      const created = item.jobId
        ? await retryGeneration(item.jobId)
        : await createCampaignGeneration(item);
      applyJobResponse(item.localId, created);
      const completed = await waitForGeneration(created, {
        signal: controller.signal,
        onUpdate: (response) => applyJobResponse(item.localId, response),
      });
      applyJobResponse(item.localId, completed);
      if (
        completed.job.status === "succeeded" &&
        !completed.validationMode &&
        completed.job.outputUrl
      ) {
        pushHistory({
          videoUrl: completed.job.outputUrl,
          effect: item.presetId,
          effectName: item.presetName,
          model: completed.job.model,
          watermark: completed.job.watermark,
          demo: false,
        });
      }
      if (completed.job.status === "succeeded") {
        track("generation_success", {
          job_id: completed.job.id,
          preset_id: item.presetId,
          source: "sku_campaign",
          validation_mode: completed.validationMode,
        });
      } else {
        track("generation_failed", {
          job_id: completed.job.id,
          preset_id: item.presetId,
          source: "sku_campaign",
          reason: completed.job.error || completed.job.status,
        });
      }
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") {
        updateJob(item.localId, { status: "canceled", error: "Stopped locally." });
        return;
      }
      updateJob(item.localId, {
        status: "failed",
        error: caught instanceof Error ? caught.message : "Task failed.",
      });
      track("generation_failed", {
        preset_id: item.presetId,
        source: "sku_campaign",
        reason:
          caught instanceof GenerationApiError
            ? caught.code || String(caught.status)
            : "client_error",
      });
    } finally {
      abortControllers.current.delete(item.localId);
    }
  }

  async function runPool(queue: CampaignJob[]) {
    let cursor = 0;
    async function worker() {
      while (cursor < queue.length) {
        const index = cursor;
        cursor += 1;
        await executeJob(queue[index]);
      }
    }
    await Promise.all([worker(), worker()]);
  }

  async function runCampaign() {
    if (!assets.front) {
      setError("Add the required front reference before building a campaign.");
      return;
    }
    if (selectedPresets.length === 0 || selectedRatios.length === 0) {
      setError("Select at least one effect and one aspect ratio.");
      return;
    }
    const queue = selectedPresets.flatMap((presetId) => {
      const preset = PRESETS.find((item) => item.slug === presetId)!;
      return selectedRatios.map<CampaignJob>((aspectRatio) => ({
        localId: `${presetId}-${aspectRatio}`,
        presetId,
        presetName: preset.name,
        aspectRatio,
        status: "queued",
        progress: 0,
      }));
    });
    setError(null);
    setJobs(queue);
    setRunning(true);
    track("studio_start", {
      source: "sku_campaign",
      job_count: queue.length,
      asset_count: Object.keys(assets).length,
    });
    await runPool(queue);
    setRunning(false);
  }

  async function retryFailed() {
    if (failedJobs.length === 0) return;
    setError(null);
    setRunning(true);
    await runPool(failedJobs);
    setRunning(false);
  }

  function exportManifest() {
    if (jobs.length === 0) return;
    const rows = [
      [
        "campaign",
        "sku",
        "job_id",
        "preset",
        "aspect_ratio",
        "status",
        "validation_mode",
        "output_url",
        "error",
      ],
      ...jobs.map((job) => [
        campaignName,
        sku,
        job.jobId,
        job.presetId,
        job.aspectRatio,
        job.status,
        job.validationMode ? "true" : "false",
        job.videoUrl,
        job.error,
      ]),
    ];
    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `pikbo-${(sku || campaignName || "campaign")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}-manifest.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="rounded-2xl border border-[var(--mint)]/35 bg-[color-mix(in_srgb,var(--mint)_7%,transparent)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[var(--mint)]">SKU Campaign workspace</p>
            <p className="mt-1 max-w-2xl text-sm text-[var(--fg-muted)]">
              One owned toy, several effects and ratios. Every output remains a separate trackable job, so one failure never destroys the campaign.
            </p>
          </div>
          <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] text-[var(--fg-dim)]">
            Max 2 active client submissions
          </span>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,460px)_1fr]">
        <div className="space-y-4">
          <section className="card p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
              1 · Campaign identity
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold text-[var(--fg-muted)]">
                Campaign name
                <input
                  value={campaignName}
                  onChange={(event) => setCampaignName(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm font-normal text-[var(--fg)] outline-none focus:border-[var(--brand)]"
                />
              </label>
              <label className="text-xs font-semibold text-[var(--fg-muted)]">
                SKU / project code
                <input
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  placeholder="e.g. PKB-GHOST-01"
                  className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm font-normal text-[var(--fg)] outline-none focus:border-[var(--brand)]"
                />
              </label>
            </div>
          </section>

          <section className="card p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
              2 · Product reference set
            </p>
            <p className="mt-1 text-xs text-[var(--fg-muted)]">
              Front is required. Side, back, and packaging improve consistency across the batch.
            </p>
            <div className="mt-3">
              <ToyAssetGrid
                assets={assets}
                onChange={(next) => {
                  setAssets(next);
                  uploadedAssetsPromise.current = null;
                }}
                onError={setError}
                compact
              />
            </div>
            {!assets.front && (
              <div className="mt-3 flex flex-wrap gap-2">
                {SAMPLE_TOYS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] hover:border-[var(--brand)]"
                    onClick={async () => {
                      try {
                        const dataUrl = await sampleToDataUrl(sample.path);
                        setAssets({
                          ...assets,
                          front: {
                            role: "front",
                            dataUrl,
                            fileName: `${sample.label} lab sample`,
                          },
                        });
                        uploadedAssetsPromise.current = null;
                        setError(null);
                      } catch {
                        setError("Sample load failed.");
                      }
                    }}
                  >
                    Sample: {sample.label}
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="card p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
              3 · Campaign matrix
            </p>
            <div className="mt-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[var(--fg-muted)]">Effects</p>
                <span className="text-[10px] text-[var(--fg-dim)]">
                  {selectedPresets.length} selected
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setCategoryFilter("all")}
                  className={`rounded-full border px-2 py-0.5 text-[10px] ${
                    categoryFilter === "all"
                      ? "border-[var(--brand)] text-[var(--fg)]"
                      : "border-[var(--border)] text-[var(--fg-dim)]"
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    title={category.blurb}
                    onClick={() => setCategoryFilter(category.id)}
                    className={`rounded-full border px-2 py-0.5 text-[10px] ${
                      categoryFilter === category.id
                        ? "border-[var(--brand)] text-[var(--fg)]"
                        : "border-[var(--border)] text-[var(--fg-dim)]"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              <div className="mt-2 grid max-h-60 grid-cols-2 gap-1.5 overflow-y-auto pr-1">
                {visiblePresets.map((preset) => {
                  const selected = selectedPresets.includes(preset.slug);
                  return (
                    <button
                      key={preset.slug}
                      type="button"
                      onClick={() => togglePreset(preset.slug)}
                      className={`truncate rounded-lg border px-2 py-1.5 text-left text-[11px] ${
                        selected
                          ? "border-[var(--brand)] bg-[var(--grad-soft)]"
                          : "border-[var(--border)] text-[var(--fg-muted)]"
                      }`}
                    >
                      {selected ? "✓ " : ""}
                      {preset.emoji} {preset.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-[var(--fg-muted)]">Ratios</p>
                <div className="mt-2 flex gap-2">
                  {(["9:16", "1:1", "16:9"] as const).map((ratio) => {
                    const selected = selectedRatios.includes(ratio);
                    return (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => toggleRatio(ratio)}
                        className={`flex-1 rounded-lg border py-2 text-[11px] font-semibold ${
                          selected
                            ? "border-[var(--brand)] bg-[var(--grad-soft)]"
                            : "border-[var(--border)] text-[var(--fg-muted)]"
                        }`}
                      >
                        {selected ? "✓ " : ""}
                        {ratio}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--fg-muted)]">Duration</p>
                <div className="mt-2 flex gap-2">
                  {([5, 10] as const).map((seconds) => (
                    <button
                      key={seconds}
                      type="button"
                      onClick={() => setDuration(seconds)}
                      className={`flex-1 rounded-lg border py-2 text-xs font-semibold ${
                        duration === seconds
                          ? "border-[var(--brand)] bg-[var(--grad-soft)]"
                          : "border-[var(--border)] text-[var(--fg-muted)]"
                      }`}
                    >
                      {seconds}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-3">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold">Campaign estimate</p>
                  <p className="mt-1 text-[10px] text-[var(--fg-dim)]">
                    {selectedPresets.length} effects × {selectedRatios.length} ratios
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{plannedCount} jobs</p>
                  <p className="text-[10px] text-[var(--fg-dim)]">
                    up to {estimatedCredits} credits
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={
                running ||
                !assets.front ||
                selectedPresets.length === 0 ||
                selectedRatios.length === 0
              }
              onClick={() => void runCampaign()}
              className="btn btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-45"
            >
              {running ? "Campaign running…" : `Create ${plannedCount} trackable jobs`}
            </button>
            <p className="mt-2 text-center text-[10px] text-[var(--fg-dim)]">
              Private validation jobs make no model call and charge 0. Real jobs are metered server-side.
            </p>
            {error && <p className="mt-3 text-sm text-[var(--brand)]">{error}</p>}
          </section>
        </div>

        <section className="card min-h-[620px] p-4 sm:p-5 xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
                4 · Task queue
              </p>
              <h2 className="mt-1 text-lg font-semibold">{campaignName || "Untitled campaign"}</h2>
              <p className="mt-1 text-xs text-[var(--fg-dim)]">
                {sku ? `SKU ${sku} · ` : ""}each result keeps its own status and retry path
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={exportManifest}
                disabled={jobs.length === 0}
                className="btn btn-ghost px-3 py-1.5 text-xs disabled:opacity-40"
              >
                Export CSV
              </button>
              <button
                type="button"
                disabled
                title="ZIP export will arrive with cloud asset storage"
                className="btn btn-ghost px-3 py-1.5 text-xs opacity-45"
              >
                ZIP after storage
              </button>
            </div>
          </div>

          {jobs.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <QueueStat label="Active" value={activeJobs.length} tone="violet" />
              <QueueStat label="Ready" value={succeededJobs.length} tone="mint" />
              <QueueStat label="Validated" value={validationJobs.length} tone="mint" />
              <QueueStat label="Failed" value={failedJobs.length} tone="pink" />
            </div>
          )}

          {failedJobs.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--brand)]/35 p-3">
              <p className="text-xs text-[var(--fg-muted)]">
                {failedJobs.length} task{failedJobs.length === 1 ? "" : "s"} failed. Completed outputs are untouched.
              </p>
              <button
                type="button"
                onClick={() => void retryFailed()}
                disabled={running}
                className="btn btn-ghost px-3 py-1.5 text-xs disabled:opacity-40"
              >
                Retry failed only
              </button>
            </div>
          )}

          {jobs.length === 0 ? (
            <div className="grid min-h-[460px] place-items-center text-center">
              <div className="max-w-sm">
                <p className="text-4xl">📦</p>
                <p className="mt-4 font-medium">Your campaign queue will appear here</p>
                <p className="mt-1 text-sm text-[var(--fg-dim)]">
                  Choose several effects and ratios to create a reusable SKU delivery manifest.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {jobs.map((item) => (
                <article
                  key={item.localId}
                  className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]"
                >
                  {item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      controls
                      muted
                      playsInline
                      className="aspect-video w-full bg-black object-contain"
                    />
                  ) : (
                    <div className="relative grid aspect-video place-items-center bg-black/35">
                      <span className="text-2xl">
                        {PRESETS.find((preset) => preset.slug === item.presetId)?.emoji ?? "🧸"}
                      </span>
                      {(item.status === "submitting" || item.status === "running") && (
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--border)]">
                          <div
                            className={`h-full bg-[var(--mint)] ${
                              item.progress ? "" : "w-1/3 animate-pulse"
                            }`}
                            style={item.progress ? { width: `${item.progress}%` } : undefined}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold">{item.presetName}</p>
                        <p className="mt-0.5 text-[10px] text-[var(--fg-dim)]">
                          {item.aspectRatio} · {duration}s
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    {item.validationMode && (
                      <p className="mt-2 rounded-lg border border-[var(--mint)]/30 px-2 py-1.5 text-[10px] text-[var(--mint)]">
                        Private validation · no model call · 0 credits
                      </p>
                    )}
                    {item.error && (
                      <p className="mt-2 text-[10px] text-[var(--brand)]">{item.error}</p>
                    )}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-[9px] text-[var(--fg-dim)]">
                        {item.jobId || item.localId}
                      </span>
                      {item.status === "failed" && (
                        <button
                          type="button"
                          disabled={running}
                          onClick={async () => {
                            setRunning(true);
                            await executeJob(item);
                            setRunning(false);
                          }}
                          className="text-[10px] font-semibold text-[var(--brand)] hover:underline disabled:opacity-40"
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-5 border-t border-[var(--border)] pt-4 text-[11px] text-[var(--fg-dim)]">
            Finished real clips are also saved to{" "}
            <Link href="/library" className="text-[var(--brand)] hover:underline">
              Library
            </Link>
            . CSV export works now; ZIP delivery is intentionally deferred until cloud asset storage is wired.
          </div>
        </section>
      </div>
    </div>
  );
}

function QueueStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "violet" | "mint" | "pink";
}) {
  const color =
    tone === "mint"
      ? "text-[var(--mint)]"
      : tone === "pink"
        ? "text-[var(--brand)]"
        : "text-[var(--brand-2)]";
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-3">
      <p className={`text-lg font-semibold ${color}`}>{value}</p>
      <p className="text-[9px] uppercase tracking-wider text-[var(--fg-dim)]">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: CampaignJobStatus }) {
  const label = status === "validation" ? "validated" : status;
  const color =
    status === "succeeded" || status === "validation"
      ? "text-[var(--mint)]"
      : status === "failed"
        ? "text-[var(--brand)]"
        : status === "running" || status === "submitting"
          ? "text-[var(--brand-2)]"
          : "text-[var(--fg-dim)]";
  return (
    <span className={`text-[9px] font-bold uppercase tracking-wider ${color}`}>
      {label}
    </span>
  );
}
