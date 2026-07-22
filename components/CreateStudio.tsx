"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createGeneration,
  GenerationApiError,
  retryGeneration,
  uploadGenerationAssets,
  waitForGeneration,
  type GenerationJob,
  type GenerationRequest,
  type GenerationResponse,
} from "@/components/studio/generation-client";
import {
  ToyAssetGrid,
  type ToyAssetDraft,
} from "@/components/studio/ToyAssetGrid";
import { useToast } from "@/components/Toast";
import { track } from "@/lib/analytics";
import { pushHistory } from "@/lib/history";
import { PRESETS } from "@/lib/presets";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { SAMPLE_TOYS, sampleToDataUrl } from "@/lib/samples";
import type { PublicSession } from "@/lib/session";
import { site } from "@/lib/site";

type Mode = "i2v" | "t2v";
type UiStatus =
  | "idle"
  | "submitting"
  | "queued"
  | "running"
  | "done"
  | "validation"
  | "error";
type AspectRatio = GenerationRequest["aspectRatio"];
type AssetMap = Partial<Record<ToyAssetDraft["role"], ToyAssetDraft>>;

const MODELS = [
  {
    id: "seedance-2",
    label: "Seedance 2.0",
    vendor: "ByteDance",
    blurb: "Best identity consistency · paid",
    free: false,
  },
  {
    id: "seedance-fast",
    label: "Seedance Fast",
    vendor: "ByteDance",
    blurb: "Fast validation clips · free",
    free: true,
  },
] as const;

const PURPOSES = [
  {
    id: "shop-listing",
    label: "Shop listing",
    detail: "Clear product motion for a listing",
    icon: "🛍️",
  },
  {
    id: "social-launch",
    label: "Social launch",
    detail: "A scroll-stopping vertical reveal",
    icon: "🚀",
  },
  {
    id: "live-selling",
    label: "Live selling",
    detail: "Hooks for Whatnot and TikTok Shop",
    icon: "📣",
  },
  {
    id: "collector-story",
    label: "Collector story",
    detail: "Bring a shelf favorite to life",
    icon: "✨",
  },
] as const;

function isPublicSession(value: unknown): value is PublicSession {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.credits === "number" &&
    typeof candidate.plan === "string" &&
    typeof candidate.planName === "string" &&
    typeof candidate.watermark === "boolean"
  );
}

function statusLabel(status: UiStatus) {
  if (status === "submitting") return "Creating task";
  if (status === "queued") return "Queued";
  if (status === "running") return "Generating";
  if (status === "done") return "Ready";
  if (status === "validation") return "Validated";
  if (status === "error") return "Needs attention";
  return "Ready to configure";
}

export function CreateStudio({
  initialEffect,
  initialModel,
  initialPrompt,
}: {
  initialEffect?: string;
  initialModel?: string;
  initialMode?: Mode;
  initialPrompt?: string;
}) {
  const initialPreset =
    PRESETS.find((item) => item.slug === initialEffect) ?? PRESETS[0];
  const [modelId, setModelId] = useState<GenerationRequest["modelId"]>(
    initialModel === "seedance-fast" ? "seedance-fast" : "seedance-2"
  );
  const [effect, setEffect] = useState(initialPreset.slug);
  const [purpose, setPurpose] = useState<(typeof PURPOSES)[number]["id"]>(
    "shop-listing"
  );
  const [assets, setAssets] = useState<AssetMap>({});
  const [prompt, setPrompt] = useState(
    initialPrompt?.trim() || initialPreset.promptTemplate
  );
  const [duration, setDuration] = useState<5 | 10>(
    initialPreset.duration === 10 ? 10 : 5
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    initialPreset.aspectRatio
  );
  const [resolution, setResolution] = useState<"480p" | "720p">("720p");
  const [presetFilter, setPresetFilter] = useState("");
  const [status, setStatus] = useState<UiStatus>("idle");
  const [job, setJob] = useState<GenerationJob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<PublicSession | null>(null);
  const [demo, setDemo] = useState(false);
  const [validationMode, setValidationMode] = useState(false);
  const [chargedCredits, setChargedCredits] = useState<number | null>(null);
  const [watermark, setWatermark] = useState(true);
  const [usedModel, setUsedModel] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLegacyFallback, setShowLegacyFallback] = useState(false);
  const [legacyPreview, setLegacyPreview] = useState(false);
  const [upgradedBanner, setUpgradedBanner] = useState(false);
  const [compare, setCompare] = useState(true);
  const [copied, setCopied] = useState(false);
  const pollController = useRef<AbortController | null>(null);
  const toast = useToast();

  const preset = useMemo(
    () => PRESETS.find((item) => item.slug === effect) ?? PRESETS[0],
    [effect]
  );
  const filteredPresets = useMemo(() => {
    const query = presetFilter.trim().toLowerCase();
    if (!query) return PRESETS;
    return PRESETS.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.tagline.toLowerCase().includes(query) ||
        item.category.includes(query)
    );
  }, [presetFilter]);

  const isFree = session?.plan === "free" || session?.watermark;
  const effectiveResolution = isFree ? "480p" : resolution;
  const busy =
    status === "submitting" || status === "queued" || status === "running";
  const currentStep =
    status === "done" || status === "validation"
      ? 4
      : assets.front
        ? effect
          ? 3
          : 2
        : 1;

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/me", { cache: "no-store" });
      const data = (await response.json()) as unknown;
      if (isPublicSession(data)) {
        setSession(data);
        setWatermark(data.watermark);
        if (data.plan === "free") setModelId("seedance-fast");
      }
    } catch {
      // The studio remains usable in private validation mode.
    }
  }, []);

  useEffect(() => {
    let canceled = false;
    async function boot() {
      await refreshSession();
      const params = new URLSearchParams(window.location.search);
      const checkoutId = params.get("session_id");
      if (checkoutId?.startsWith("cs_")) {
        try {
          const response = await fetch("/api/checkout/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: checkoutId }),
          });
          const data = (await response.json()) as { session?: unknown };
          if (!canceled && isPublicSession(data.session)) {
            setSession(data.session);
            setWatermark(data.session.watermark);
            setUpgradedBanner(true);
          }
        } catch {
          if (!canceled) await refreshSession();
        }
        const url = new URL(window.location.href);
        url.searchParams.delete("session_id");
        window.history.replaceState({}, "", url.pathname + url.search);
      } else if (params.get("upgraded") === "1" && !canceled) {
        setUpgradedBanner(true);
      }

      try {
        const pending = sessionStorage.getItem("pikbo_pending_still");
        if (pending?.startsWith("http")) {
          sessionStorage.removeItem("pikbo_pending_still");
          const dataUrl = await sampleToDataUrl(pending);
          if (!canceled) {
            setAssets({
              front: {
                role: "front",
                dataUrl,
                fileName: "Pikbo Image Studio still",
              },
            });
          }
        }
      } catch {
        // Optional handoff from Image Studio.
      }
    }
    void boot();
    return () => {
      canceled = true;
      pollController.current?.abort();
    };
  }, [refreshSession]);

  function selectEffect(slug: string) {
    const next = PRESETS.find((item) => item.slug === slug);
    if (!next) return;
    setEffect(next.slug);
    setPrompt(next.promptTemplate);
    setDuration(next.duration === 10 ? 10 : 5);
    setAspectRatio(next.aspectRatio);
    track("template_select", { preset_id: next.slug, source: "studio" });
  }

  function applyResponse(response: GenerationResponse) {
    setJob(response.job);
    setValidationMode(response.validationMode);
    setDemo(response.job.demo);
    setWatermark(response.job.watermark);
    setUsedModel(response.job.model ?? null);
    if (isPublicSession(response.session)) setSession(response.session);
    if (typeof response.chargedCredits === "number") {
      setChargedCredits(response.chargedCredits);
    }
    if (response.job.status === "queued") setStatus("queued");
    if (response.job.status === "running") setStatus("running");
  }

  function completeResponse(response: GenerationResponse) {
    applyResponse(response);
    const { job: completed } = response;
    if (completed.status === "failed" || completed.status === "canceled") {
      setStatus("error");
      setError(
        completed.error ||
          (completed.status === "canceled"
            ? "This generation was canceled."
            : "Generation failed. You can retry this task.")
      );
      track("generation_failed", {
        job_id: completed.id,
        preset_id: effect,
        reason: completed.error || completed.status,
      });
      toast("Generation needs attention — no credits were lost");
      return;
    }
    if (response.validationMode) {
      setStatus("validation");
      setVideoUrl(completed.outputUrl ?? null);
      track("generation_success", {
        job_id: completed.id,
        preset_id: effect,
        validation_mode: true,
      });
      toast("Private validation completed · 0 credits charged");
      return;
    }
    if (!completed.outputUrl) {
      setStatus("error");
      setError("The task finished without a downloadable video.");
      track("generation_failed", {
        job_id: completed.id,
        preset_id: effect,
        reason: "missing_output",
      });
      return;
    }
    setVideoUrl(completed.outputUrl);
    setStatus("done");
    pushHistory({
      videoUrl: completed.outputUrl,
      effect,
      effectName: preset.name,
      model: completed.model,
      watermark: completed.watermark,
      demo: false,
    });
    track("generation_success", {
      job_id: completed.id,
      preset_id: effect,
      validation_mode: false,
    });
    toast("Clip ready · saved to your history");
  }

  function requestBody(): GenerationRequest {
    return {
      presetId: effect,
      assets: Object.values(assets).map((asset) => ({
        role: asset.role,
        dataUrl: asset.dataUrl,
      })),
      purpose,
      prompt,
      aspectRatio,
      duration,
      modelId,
      resolution: effectiveResolution,
    };
  }

  async function submitGenerationRequest() {
    const request = requestBody();
    try {
      return await createGeneration(request);
    } catch (caught) {
      if (
        caught instanceof GenerationApiError &&
        caught.code === "live_assets_must_be_uploaded"
      ) {
        const uploadedAssets = await uploadGenerationAssets(Object.values(assets));
        return createGeneration({ ...request, assets: uploadedAssets });
      }
      throw caught;
    }
  }

  async function runAsyncGeneration() {
    if (!assets.front) {
      setError("Add a front reference of your toy before generating.");
      return;
    }

    pollController.current?.abort();
    const controller = new AbortController();
    pollController.current = controller;
    setError(null);
    setVideoUrl(null);
    setJob(null);
    setDemo(false);
    setValidationMode(false);
    setLegacyPreview(false);
    setChargedCredits(null);
    setShowPaywall(false);
    setShowLegacyFallback(false);
    setStatus("submitting");
    track("studio_start", {
      preset_id: effect,
      purpose,
      asset_count: Object.keys(assets).length,
    });
    track("generation_start", {
      preset_id: effect,
      model_id: modelId,
      validation_candidate: true,
    });

    try {
      const created = await submitGenerationRequest();
      applyResponse(created);
      const completed = await waitForGeneration(created, {
        signal: controller.signal,
        onUpdate: applyResponse,
      });
      completeResponse(completed);
      await refreshSession();
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") return;
      const apiError =
        caught instanceof GenerationApiError ? caught : undefined;
      if (
        apiError?.status === 402 ||
        apiError?.code === "INSUFFICIENT_CREDITS"
      ) {
        setShowPaywall(true);
      }
      if (apiError?.status === 404 || apiError?.status === 501) {
        setShowLegacyFallback(true);
      }
      setError(
        caught instanceof Error ? caught.message : "Generation request failed."
      );
      setStatus("error");
      track("generation_failed", {
        preset_id: effect,
        reason:
          caught instanceof GenerationApiError
            ? caught.code || String(caught.status)
            : "client_error",
      });
      await refreshSession();
    }
  }

  async function retryCurrentJob() {
    if (!job?.id) {
      await runAsyncGeneration();
      return;
    }
    pollController.current?.abort();
    const controller = new AbortController();
    pollController.current = controller;
    setError(null);
    setStatus("submitting");
    track("generation_start", {
      preset_id: effect,
      retry: true,
      job_id: job.id,
    });
    try {
      const retried = await retryGeneration(job.id);
      applyResponse(retried);
      const completed = await waitForGeneration(retried, {
        signal: controller.signal,
        onUpdate: applyResponse,
      });
      completeResponse(completed);
      await refreshSession();
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") return;
      setError(caught instanceof Error ? caught.message : "Retry failed.");
      setStatus("error");
      track("generation_failed", {
        preset_id: effect,
        retry: true,
        job_id: job.id,
      });
    }
  }

  async function runLegacyPreview() {
    if (!assets.front) return;
    setStatus("submitting");
    setError(null);
    setShowLegacyFallback(false);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          effect,
          image: assets.front.dataUrl,
          extra: prompt,
          duration,
          aspectRatio,
          model: modelId,
          resolution: effectiveResolution,
        }),
      });
      const data = (await response.json()) as Record<string, unknown>;
      if (!response.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Compatibility preview failed."
        );
      }
      const url = typeof data.videoUrl === "string" ? data.videoUrl : null;
      setVideoUrl(url);
      setDemo(true);
      setValidationMode(true);
      setLegacyPreview(true);
      setChargedCredits(0);
      setWatermark(Boolean(data.watermark ?? true));
      setUsedModel(typeof data.model === "string" ? data.model : "Legacy preview");
      setStatus("validation");
      if (isPublicSession(data.session)) setSession(data.session);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Compatibility preview failed."
      );
      setStatus("error");
    }
  }

  async function copyLink() {
    if (!videoUrl) return;
    try {
      await navigator.clipboard.writeText(videoUrl);
      setCopied(true);
      toast("Link copied");
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Could not copy this link.");
    }
  }

  function shareX() {
    if (!videoUrl) return;
    const text = encodeURIComponent(`Made with ${site.name} — ${preset.name} 🧸`);
    const url = encodeURIComponent(videoUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && !busy) {
        event.preventDefault();
        void runAsyncGeneration();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // runAsyncGeneration intentionally follows the current form state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, assets, effect, purpose, prompt, aspectRatio, duration, modelId]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[var(--bg)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3">
          <div>
            <p className="text-sm font-semibold">Toy Video Studio</p>
            <p className="text-[10px] text-[var(--fg-dim)]">
              One owned toy · private references · channel-ready motion
            </p>
          </div>
          <div className="order-3 flex w-full items-center gap-1 sm:order-none sm:ml-5 sm:w-auto">
            {["Assets", "Creative", "Quote", "Result"].map((label, index) => {
              const number = index + 1;
              const active = number === currentStep;
              const complete = number < currentStep;
              return (
                <div key={label} className="flex flex-1 items-center gap-1 sm:flex-none">
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold ${
                      active
                        ? "bg-[var(--brand)] text-white"
                        : complete
                          ? "bg-[var(--mint)] text-black"
                          : "bg-[var(--card)] text-[var(--fg-dim)]"
                    }`}
                  >
                    {complete ? "✓" : number}
                  </span>
                  <span className="hidden text-[10px] text-[var(--fg-muted)] sm:inline">
                    {label}
                  </span>
                  {index < 3 && (
                    <span className="h-px flex-1 bg-[var(--border)] sm:w-5 sm:flex-none" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="ml-auto flex items-center gap-3 text-xs">
            <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--fg-muted)]">
              {statusLabel(status)}
            </span>
            {session && (
              <span className="hidden text-[var(--fg-muted)] md:inline">
                <strong className="text-[var(--mint)]">{session.credits}</strong>{" "}
                credits
              </span>
            )}
            <Link href="/pricing" className="text-[var(--mint)] hover:underline">
              Plans
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-[minmax(0,1fr)] gap-0 xl:grid-cols-[minmax(0,620px)_1fr]">
        <main className="min-w-0 space-y-4 border-b border-[var(--border)] p-4 xl:border-b-0 xl:border-r xl:p-6">
          {(validationMode || demo) && (
            <div className="rounded-xl border border-[var(--mint)]/40 bg-[color-mix(in_srgb,var(--mint)_8%,transparent)] p-3 text-xs">
              <p className="font-semibold text-[var(--mint)]">
                Private validation · no model call · no credit charge
              </p>
              <p className="mt-1 text-[var(--fg-muted)]">
                {legacyPreview
                  ? "Compatibility preview is cached and unrelated to your uploaded toy. It only proves the player flow."
                  : "This run validates the product workflow. It is not presented as a newly generated clip."}
              </p>
            </div>
          )}
          {upgradedBanner && (
            <div className="rounded-xl border border-[var(--mint)]/40 px-3 py-2 text-xs">
              Paid plan active — HD generation and clean exports are available.
            </div>
          )}

          <section className="card p-4 sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
                  Step 1 · Product references
                </p>
                <h1 className="mt-1 text-xl font-semibold">Show us the exact toy</h1>
                <p className="mt-1 text-xs text-[var(--fg-muted)]">
                  Front drives the current Seedance clip. Optional angles stay with the task for review and future multi-reference models.
                </p>
              </div>
              <span className="rounded-full bg-[var(--bg-soft)] px-2 py-1 text-[9px] text-[var(--fg-dim)]">
                PNG/JPG/WebP · 10 MB each
              </span>
            </div>
            <ToyAssetGrid assets={assets} onChange={setAssets} onError={setError} />
            {!assets.front && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-[var(--fg-dim)]">Try a lab sample:</span>
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
                        selectEffect(sample.effect);
                        setError(null);
                      } catch {
                        setError("Could not load this sample still.");
                      }
                    }}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            )}
            <p className="mt-3 text-[10px] text-[var(--fg-dim)]">
              Upload only toys and character artwork you own or are authorized to use.
            </p>
          </section>

          <section className="card p-4 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
              Step 2 · Creative direction
            </p>
            <h2 className="mt-1 text-lg font-semibold">What should this clip do?</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {PURPOSES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPurpose(item.id)}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    purpose === item.id
                      ? "border-[var(--brand)] bg-[var(--grad-soft)]"
                      : "border-[var(--border)] bg-[var(--bg-soft)] hover:border-[var(--fg-dim)]"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>{" "}
                  <span className="text-xs font-semibold">{item.label}</span>
                  <span className="mt-1 block text-[10px] text-[var(--fg-dim)]">
                    {item.detail}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-[var(--fg-muted)]">Choose an effect</p>
              <input
                value={presetFilter}
                onChange={(event) => setPresetFilter(event.target.value)}
                placeholder="Search spin, unbox…"
                className="w-44 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-2.5 py-1.5 text-xs outline-none focus:border-[var(--brand)]"
              />
            </div>
            <div className="mt-2 grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {filteredPresets.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => selectEffect(item.slug)}
                  className={`flex items-center gap-3 rounded-xl border p-2.5 text-left ${
                    effect === item.slug
                      ? "border-[var(--brand)] bg-[var(--grad-soft)]"
                      : "border-[var(--border)] bg-[var(--bg-soft)] hover:border-[var(--fg-dim)]"
                  }`}
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-lg"
                    style={{ background: item.gradient }}
                  >
                    {item.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold">{item.name}</span>
                    <span className="mt-0.5 block truncate text-[10px] text-[var(--fg-dim)]">
                      {item.tagline}
                    </span>
                  </span>
                </button>
              ))}
              {filteredPresets.length === 0 && (
                <p className="text-xs text-[var(--fg-dim)]">No effects match.</p>
              )}
            </div>

            <label className="mt-4 block text-xs font-semibold text-[var(--fg-muted)]">
              Motion instructions
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2.5 text-sm font-normal text-[var(--fg)] outline-none focus:border-[var(--brand)]"
              />
            </label>
          </section>

          <section className="card p-4 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
              Step 3 · Output & quote
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-[var(--fg-muted)]">Model</p>
                <div className="mt-2 space-y-2">
                  {MODELS.map((model) => {
                    const locked = Boolean(isFree && !model.free);
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          if (locked) {
                            setShowPaywall(true);
                            setError("Seedance 2.0 requires a paid plan. Free uses Fast.");
                            return;
                          }
                          setModelId(model.id);
                        }}
                        className={`w-full rounded-xl border p-3 text-left ${
                          modelId === model.id
                            ? "border-[var(--brand)] bg-[var(--grad-soft)]"
                            : "border-[var(--border)] bg-[var(--bg-soft)]"
                        } ${locked ? "opacity-60" : ""}`}
                      >
                        <span className="text-xs font-semibold">
                          {model.label} {locked ? "🔒" : ""}
                        </span>
                        <span className="mt-1 block text-[10px] text-[var(--fg-dim)]">
                          {model.vendor} · {model.blurb}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-3">
                <ChoiceRow
                  label="Duration"
                  options={["5", "10"]}
                  value={String(duration)}
                  onChange={(value) => setDuration(value === "10" ? 10 : 5)}
                />
                <ChoiceRow
                  label="Aspect"
                  options={["9:16", "1:1", "16:9"]}
                  value={aspectRatio}
                  onChange={(value) => setAspectRatio(value as AspectRatio)}
                />
                <ChoiceRow
                  label="Resolution"
                  options={["480p", "720p"]}
                  value={effectiveResolution}
                  onChange={(value) => {
                    if (isFree && value === "720p") {
                      setShowPaywall(true);
                      setError("720p clean exports require a paid plan.");
                      return;
                    }
                    setResolution(value as "480p" | "720p");
                  }}
                />
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold">Generation estimate</p>
                  <p className="mt-1 text-[10px] text-[var(--fg-dim)]">
                    1 clip · {duration}s · {aspectRatio} · {effectiveResolution}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold">{CREDITS_PER_VIDEO} credits</p>
                  <p className="text-[10px] text-[var(--fg-dim)]">
                    Final charge is confirmed by the server
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void runAsyncGeneration()}
              disabled={busy || !assets.front}
              className="btn btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-45"
            >
              {busy
                ? `${statusLabel(status)}${job?.progress ? ` · ${job.progress}%` : "…"}`
                : "Create video task"}
            </button>
            <p className="mt-2 text-center text-[10px] text-[var(--fg-dim)]">
              Real mode may charge only after the server accepts the job. Private validation charges 0.
            </p>

            {error && (
              <div className="mt-3 rounded-xl border border-[var(--brand)]/40 p-3 text-sm">
                <p className="text-[var(--brand)]">{error}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {job?.id && (
                    <button
                      type="button"
                      onClick={() => void retryCurrentJob()}
                      className="btn btn-ghost px-3 py-1.5 text-xs"
                    >
                      Retry task
                    </button>
                  )}
                  {showLegacyFallback && (
                    <button
                      type="button"
                      onClick={() => void runLegacyPreview()}
                      className="btn btn-ghost px-3 py-1.5 text-xs"
                    >
                      Use compatibility preview
                    </button>
                  )}
                  {showPaywall && (
                    <Link href="/pricing" className="btn btn-primary px-3 py-1.5 text-xs">
                      Compare plans
                    </Link>
                  )}
                </div>
                {showLegacyFallback && (
                  <p className="mt-2 text-[10px] text-[var(--fg-dim)]">
                    Compatibility mode is optional and clearly labeled. It never claims the cached clip matches your upload.
                  </p>
                )}
              </div>
            )}
          </section>
        </main>

        <aside className="min-w-0 min-h-[70vh] bg-[var(--bg-soft)] p-4 xl:sticky xl:top-[65px] xl:h-[calc(100vh-65px)] xl:p-6">
          <div className="flex h-full flex-col">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">Result workspace</p>
                <p className="text-[10px] text-[var(--fg-dim)]">
                  {preset.name} · {PURPOSES.find((item) => item.id === purpose)?.label}
                </p>
              </div>
              <div className="flex gap-2">
                {job?.id && (
                  <span className="rounded-full border border-[var(--border)] px-2 py-1 font-mono text-[9px] text-[var(--fg-dim)]">
                    {job.id.slice(0, 12)}
                  </span>
                )}
                <span className="rounded-full border border-[var(--border)] px-2 py-1 text-[9px] text-[var(--fg-dim)]">
                  {usedModel || MODELS.find((item) => item.id === modelId)?.label}
                </span>
              </div>
            </div>

            <div className="relative flex min-h-[520px] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-black/50">
              {busy && (
                <div className="w-full max-w-sm p-8 text-center">
                  <div className="mx-auto h-11 w-11 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--mint)]" />
                  <p className="mt-5 font-medium">{statusLabel(status)}</p>
                  <p className="mt-1 text-xs text-[var(--fg-dim)]">
                    {job?.status === "queued"
                      ? "The task is waiting for provider capacity."
                      : job?.status === "running"
                        ? "The provider reports that rendering is in progress."
                        : "Sending references and configuration securely."}
                  </p>
                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
                    {job?.progress ? (
                      <div
                        className="h-full rounded-full bg-[var(--mint)] transition-[width]"
                        style={{ width: `${job.progress}%` }}
                      />
                    ) : (
                      <div className="h-full w-1/3 animate-pulse rounded-full bg-[var(--mint)]" />
                    )}
                  </div>
                  <p className="mt-3 text-[10px] text-[var(--fg-dim)]">
                    Progress comes from the task API; PIKBO does not invent a completion percentage.
                  </p>
                </div>
              )}

              {!busy && videoUrl && (
                <div className="w-full p-3 sm:p-5">
                  <div className="mb-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCompare((value) => !value)}
                      className="text-[10px] font-semibold text-[var(--brand)] hover:underline"
                    >
                      {compare ? "Video only" : "Reference ↔ result"}
                    </button>
                  </div>
                  <div className={compare ? "grid gap-3 sm:grid-cols-2" : ""}>
                    {compare && assets.front && (
                      <div>
                        <p className="mb-2 text-center text-[9px] font-bold uppercase tracking-wider text-[var(--fg-dim)]">
                          Front reference
                        </p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={assets.front.dataUrl}
                          alt="Uploaded front toy reference"
                          className="mx-auto max-h-[60vh] rounded-xl object-contain"
                        />
                      </div>
                    )}
                    <div className="relative">
                      {compare && (
                        <p className="mb-2 text-center text-[9px] font-bold uppercase tracking-wider text-[var(--fg-dim)]">
                          {validationMode ? "Validation preview" : "Generated result"}
                        </p>
                      )}
                      <video
                        src={videoUrl}
                        poster={job?.posterUrl}
                        controls
                        autoPlay={!validationMode}
                        loop
                        muted
                        playsInline
                        className="mx-auto max-h-[60vh] rounded-xl"
                      />
                      {watermark && !validationMode && (
                        <span
                          className="pointer-events-none absolute bottom-3 right-3 rounded-md px-2 py-1 text-[10px] font-bold text-white"
                          style={{ background: "var(--grad)" }}
                        >
                          {site.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {!busy && status === "validation" && !videoUrl && (
                <div className="max-w-md p-10 text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[color-mix(in_srgb,var(--mint)_15%,transparent)] text-2xl">
                    ✓
                  </span>
                  <h2 className="mt-4 text-xl font-semibold">Workflow validated</h2>
                  <p className="mt-2 text-sm text-[var(--fg-muted)]">
                    Your references and recipe passed validation. No provider request was sent, no video was fabricated, and no credits were charged.
                  </p>
                </div>
              )}

              {!busy && !videoUrl && status !== "validation" && (
                <div className="max-w-sm p-10 text-center">
                  {assets.front ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={assets.front.dataUrl}
                      alt="Toy ready to animate"
                      className="mx-auto max-h-64 rounded-xl object-contain opacity-80"
                    />
                  ) : (
                    <p className="text-4xl">🧸</p>
                  )}
                  <p className="mt-4 text-sm font-medium">
                    {assets.front ? "Your toy is ready" : "Your result will land here"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--fg-dim)]">
                    Complete the three steps, then create one trackable task.
                  </p>
                </div>
              )}
            </div>

            {(status === "done" || status === "validation") && (
              <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold">
                      {validationMode ? "Private validation" : "Generation complete"}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[var(--fg-dim)]">
                      {validationMode
                        ? `No model call · ${chargedCredits ?? 0} credits charged`
                        : `${duration}s · ${aspectRatio} · ${chargedCredits ?? CREDITS_PER_VIDEO} credits`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {videoUrl && !validationMode && (
                      <a
                        href={videoUrl}
                        download={`pikbo-${effect}.mp4`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary px-3 py-1.5 text-xs"
                      >
                        Download
                      </a>
                    )}
                    {videoUrl && (
                      <button
                        type="button"
                        onClick={() => void copyLink()}
                        className="btn btn-ghost px-3 py-1.5 text-xs"
                      >
                        {copied ? "Copied" : "Copy link"}
                      </button>
                    )}
                    {videoUrl && !validationMode && (
                      <button
                        type="button"
                        onClick={shareX}
                        className="btn btn-ghost px-3 py-1.5 text-xs"
                      >
                        Share on X
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void runAsyncGeneration()}
                      className="btn btn-ghost px-3 py-1.5 text-xs"
                    >
                      New version
                    </button>
                    <Link href="/supercomputer" className="btn btn-ghost px-3 py-1.5 text-xs">
                      Build campaign
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
function ChoiceRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-[var(--fg-muted)]">{label}</p>
      <div className="mt-1.5 flex gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex-1 rounded-lg border px-2 py-2 text-[11px] font-semibold ${
              value === option
                ? "border-[var(--brand)] bg-[var(--grad-soft)]"
                : "border-[var(--border)] bg-[var(--bg-soft)] text-[var(--fg-muted)]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
