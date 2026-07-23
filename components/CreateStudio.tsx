"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { loadFavorites, toggleFavorite } from "@/lib/favorites";
import {
  historyFieldsFromSuccess,
  postGenerate,
} from "@/lib/generateClient";
import { pushHistory } from "@/lib/history";
import { fetchMe, isDemoMode, type MeResponse } from "@/lib/meClient";
import { isValidImageDataUrl } from "@/lib/providerError";
import { SAMPLE_TOYS, sampleToDataUrl } from "@/lib/samples";
import { PRESETS } from "@/lib/presets";
import { viralName } from "@/lib/viralNames";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { site } from "@/lib/site";
import { useToast } from "@/components/Toast";
import { PaywallCard } from "@/components/PaywallCard";
import { emitSessionRefresh } from "@/lib/sessionEvents";
import {
  localLibraryNote,
  PROVENANCE,
  resultProvenanceLabel,
} from "@/lib/provenance";
import { parseRemixSearchParams } from "@/lib/remixIntent";

type Status = "idle" | "uploading" | "generating" | "done" | "error";
type Mode = "i2v" | "t2v";
type ResultCreditState =
  | "0 cached"
  | "10 used"
  | "10 restored"
  | "refund unconfirmed";

type ResultVersion = {
  id: string;
  videoUrl: string;
  demo: boolean;
  watermark: boolean;
  model: string;
  duration: number;
  aspectRatio: string;
  resolution: string;
  creditState: "0 cached" | "10 used";
  createdAt: string;
  /** Still used for this version — Before/After stays honest when switching Vn */
  sourceImage: string | null;
  requestId?: string;
  provider?: string;
  effect: string;
  effectName: string;
};

function localProjectId(image: string, source?: string): string {
  if (source) return `project-${source}`;
  let hash = 2166136261;
  const sample = image.slice(0, 4096);
  for (let i = 0; i < sample.length; i += 1) {
    hash ^= sample.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `local-${(hash >>> 0).toString(36)}`;
}

const MODELS = [
  {
    id: "seedance-mini",
    label: "Seedance Mini",
    vendor: "ByteDance",
    blurb: "Free tier · 480p",
    free: true,
  },
  {
    id: "seedance-fast",
    label: "Seedance Fast",
    vendor: "ByteDance",
    blurb: "Balanced speed · paid",
    free: false,
  },
  {
    id: "seedance-2",
    label: "Seedance 2.0",
    vendor: "ByteDance",
    blurb: "Best quality · paid",
    free: false,
  },
] as const;

export function CreateStudio({
  initialEffect,
  initialModel,
  initialMode,
  initialPrompt,
  initialSource,
  initialRatio,
  initialDuration,
  initialChannel,
  initialSample,
}: {
  initialEffect?: string;
  initialModel?: string;
  initialMode?: Mode;
  initialPrompt?: string;
  /** Official Lab project id (remix attribution) — RETENTION_REMIX_LOOP */
  initialSource?: string;
  initialRatio?: string;
  initialDuration?: string;
  initialChannel?: string;
  /** First-run sample id (orbit|moon|scout|beatbot) — load photo + ready to generate */
  initialSample?: string;
}) {
  const remix = useMemo(
    () =>
      parseRemixSearchParams({
        effect: initialEffect,
        source: initialSource,
        ratio: initialRatio,
        duration: initialDuration,
        channel: initialChannel,
      }),
    [initialEffect, initialSource, initialRatio, initialDuration, initialChannel]
  );

  const bootPreset =
    PRESETS.find((p) => p.slug === (remix.intent?.recipeSlug || initialEffect)) ??
    PRESETS[0];
  // Soft launch is photo → video only (no Text→Video / multi-model theater).
  const mode: Mode = "i2v";
  void initialMode;
  const [modelId, setModelId] = useState<(typeof MODELS)[number]["id"]>(() => {
    if (initialModel === "seedance-mini") return "seedance-mini";
    if (initialModel === "seedance-fast") return "seedance-fast";
    if (initialModel === "seedance-2") return "seedance-2";
    return "seedance-mini";
  });
  const [effect, setEffect] = useState(bootPreset.slug);
  const [image, setImage] = useState<string | null>(null);
  const [extra, setExtra] = useState(initialPrompt ?? "");
  const [duration, setDuration] = useState<5 | 10>(() => {
    if (remix.intent?.durationSeconds === 10 || remix.intent?.durationSeconds === 5) {
      return remix.intent.durationSeconds;
    }
    return bootPreset.duration === 10 ? 10 : 5;
  });
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9" | "1:1">(() => {
    if (
      remix.intent?.aspectRatio === "16:9" ||
      remix.intent?.aspectRatio === "1:1" ||
      remix.intent?.aspectRatio === "9:16"
    ) {
      return remix.intent.aspectRatio;
    }
    return bootPreset.aspectRatio === "16:9" || bootPreset.aspectRatio === "1:1"
      ? bootPreset.aspectRatio
      : "9:16";
  });
  const [status, setStatus] = useState<Status>("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [watermark, setWatermark] = useState(true);
  const [session, setSession] = useState<MeResponse | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [upgradedBanner, setUpgradedBanner] = useState(false);
  const [usedModel, setUsedModel] = useState<string | null>(null);
  /** Server-enforced meta from last success (prefer over client prefs). */
  const [resultDuration, setResultDuration] = useState<number | null>(null);
  const [resultAspect, setResultAspect] = useState<string | null>(null);
  const [resultResolution, setResultResolution] = useState<string | null>(null);
  const [presetFilter, setPresetFilter] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
  // PRD soft-launch §3/§5: user must confirm rights before submitting.
  const [ownsRights, setOwnsRights] = useState(false);
  // PRD soft-launch §5.2: an unknown deep-link slug must not silently pretend
  // the requested recipe is active.
  const requestedUnknownEffect =
    Boolean(initialEffect) && !PRESETS.some((p) => p.slug === initialEffect);
  const [showUnknownNotice, setShowUnknownNotice] = useState(
    requestedUnknownEffect
  );
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState(true);
  const [resolution, setResolution] = useState<"480p" | "720p">("720p");
  const [seed, setSeed] = useState<string>("");
  /** Collapsed by default — soft launch is photo → recipe → one generate. */
  const [showAdvanced, setShowAdvanced] = useState(false);
  /** Last failed live job restored credits (PRD §5 / W5 trust). */
  const [lastRefunded, setLastRefunded] = useState(false);
  const [sampleLoading, setSampleLoading] = useState(false);
  /** Successful retries/variants remain selectable; a new run never overwrites one. */
  const [versions, setVersions] = useState<ResultVersion[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [lastCreditState, setLastCreditState] =
    useState<ResultCreditState | null>(null);
  const toast = useToast();

  const preset = useMemo(
    () => PRESETS.find((p) => p.slug === effect)!,
    [effect]
  );

  const filteredPresets = useMemo(() => {
    const q = presetFilter.trim().toLowerCase();
    if (!q) return PRESETS;
    return PRESETS.filter((p) => {
      const viral = viralName(p.slug, p.name).toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        viral.includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.includes(q)
      );
    });
  }, [presetFilter]);

  function selectEffect(slug: string) {
    setEffect(slug);
    const p = PRESETS.find((x) => x.slug === slug);
    if (!p) return;
    // Free trial: always 5s (unit economics)
    const free = session?.plan === "free" || session?.watermark;
    setDuration(!free && p.duration === 10 ? 10 : 5);
    if (
      p.aspectRatio === "9:16" ||
      p.aspectRatio === "16:9" ||
      p.aspectRatio === "1:1"
    ) {
      setAspectRatio(p.aspectRatio);
    }
  }

  /** One-tap joy path: official Lab still + matching recipe. Rights = Lab sample. */
  async function loadSampleToy(sampleId: string, autoGenerate = false) {
    const s = SAMPLE_TOYS.find((x) => x.id === sampleId) ?? SAMPLE_TOYS[0];
    setSampleLoading(true);
    setError(null);
    try {
      const data = await sampleToDataUrl(s.path);
      setImage(data);
      selectEffect(s.effect);
      // Official Pikbo Lab stills — product-owned samples, not a visitor upload.
      setOwnsRights(true);
      if (autoGenerate) {
        toast(
          demoMode
            ? "Generating official Lab sample · cached demo free…"
            : "Generating official Lab sample · live Mini uses 10 credits…"
        );
        await generate({
          imageOverride: data,
          effectOverride: s.effect,
          rightsOverride: true,
          labSampleId: s.id,
        });
      } else {
        toast("Official Lab still ready — tap Generate when you want the clip");
      }
    } catch {
      setError("Could not load sample photo — try another or upload your own");
    } finally {
      setSampleLoading(false);
    }
  }

  useEffect(() => {
    const t = window.setTimeout(() => {
      setFavorites(loadFavorites());
      // optional still from Image studio
      try {
        const pending = sessionStorage.getItem("pikbo_pending_still");
        if (pending?.startsWith("data:image")) {
          sessionStorage.removeItem("pikbo_pending_still");
          setImage(pending);
        } else if (pending?.startsWith("http")) {
          sessionStorage.removeItem("pikbo_pending_still");
          sampleToDataUrl(pending)
            .then((data) => setImage(data))
            .catch(() => undefined);
        }
      } catch {
        // ignore
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  // First-run: ?sample=scout or ?try=1 → load sample and auto-generate
  useEffect(() => {
    if (!initialSample) return;
    const id = SAMPLE_TOYS.some((s) => s.id === initialSample)
      ? initialSample
      : "scout";
    // Defer so we don't setState synchronously inside the effect body.
    const t = window.setTimeout(() => {
      void loadSampleToy(id, true);
    }, 0);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSample]);

  useEffect(() => {
    if (status !== "generating") return;
    const t0 = Date.now();
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - t0) / 1000));
    }, 250);
    return () => window.clearInterval(id);
  }, [status]);

  function rememberEffect(slug: string) {
    try {
      const raw = localStorage.getItem("pikbo_recent_effects");
      const prev = raw ? (JSON.parse(raw) as string[]) : [];
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, 6);
      localStorage.setItem("pikbo_recent_effects", JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  const refreshSession = useCallback(async () => {
    const data = await fetchMe();
    if (!data) return;
    setSession(data);
    setWatermark(data.watermark);
    // Free path: Mini (cheapest wool) + 480p
    if (data.plan === "free" || data.watermark) {
      setModelId("seedance-mini");
      setResolution("480p");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      await refreshSession();
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const checkoutId = params.get("session_id");
      if (checkoutId?.startsWith("cs_")) {
        try {
          const res = await fetch("/api/checkout/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: checkoutId }),
          });
          const data = await res.json();
          if (!cancelled && res.ok && data.session) {
            setSession(data.session);
            setWatermark(data.session.watermark);
            setUpgradedBanner(true);
          }
        } catch {
          if (!cancelled) await refreshSession();
        }
        const url = new URL(window.location.href);
        url.searchParams.delete("session_id");
        window.history.replaceState({}, "", url.pathname + url.search);
        return;
      }
      if (params.get("upgraded") === "1" && !cancelled) {
        setUpgradedBanner(true);
        await refreshSession();
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, [refreshSession]);

  function loadFile(file: File | undefined | null) {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please drop a PNG or JPG of your toy.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    loadFile(e.target.files?.[0]);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    loadFile(e.dataTransfer.files?.[0]);
  }

  const creditsLeft = session?.credits ?? null;
  const canAfford = creditsLeft === null || creditsLeft >= CREDITS_PER_VIDEO;
  const isFree = session?.plan === "free" || session?.watermark;
  const demoMode = isDemoMode(session);
  // Free tier is hard-locked to 5s server-side; keep UI in sync without an effect.
  const effectiveDuration = isFree ? 5 : duration;

  async function generate(opts?: {
    imageOverride?: string;
    effectOverride?: string;
    rightsOverride?: boolean;
    /** Official Lab sample id — stored as Library sourceProject for support */
    labSampleId?: string;
  }) {
    const img = opts?.imageOverride ?? image;
    const fx = opts?.effectOverride ?? effect;
    const rights = opts?.rightsOverride ?? ownsRights;
    if (!img || !isValidImageDataUrl(img)) {
      setError(
        "Upload a reference image first (JPEG, PNG, WebP, or GIF · image-to-video)."
      );
      return;
    }
    if (img.length > 12_000_000) {
      setError("Image is too large. Use a photo under ~8MB.");
      return;
    }
    if (!rights) {
      setError("Confirm you own this photo before generating.");
      return;
    }
    // Do not hard-block on client credits: demo-cached mode (no FAL_KEY) is free.
    // Live path enforces credits server-side and returns 402 / paywall.

    setError(null);
    setLastRefunded(false);
    setLastCreditState(null);
    setShowPaywall(false);
    setElapsed(0);
    setStatus("generating");
    document
      .getElementById("create-result")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    const resolvedRes = isFree ? "480p" : resolution;
    const seedNum = seed.trim() === "" ? undefined : Number(seed);
    const result = await postGenerate({
      effect: fx,
      image: img,
      extra,
      duration: effectiveDuration,
      aspectRatio,
      model: modelId,
      resolution: resolvedRes,
      ownsRights: true,
      seed:
        typeof seedNum === "number" && Number.isFinite(seedNum)
          ? seedNum
          : undefined,
    });

    if (!result.ok) {
      if (result.session) {
        setSession((prev) =>
          prev ? { ...prev, ...result.session } : (result.session as MeResponse)
        );
      }
      if (result.paywall) setShowPaywall(true);
      setLastRefunded(Boolean(result.creditsRefunded));
      setLastCreditState(
        result.creditsRefunded
          ? "10 restored"
          : result.status === 0
            ? "refund unconfirmed"
            : null
      );
      setError(
        result.error ||
          (result.paywall
            ? "This allowance is used up. Compare finite plans to continue."
            : "Something went wrong")
      );
      // Keep prior versions visible after a failed attempt; leave error banner on.
      if (versions.length > 0) {
        const keep =
          versions.find((v) => v.id === activeVersionId) ?? versions[0];
        if (keep) {
          setActiveVersionId(keep.id);
          setVideoUrl(keep.videoUrl);
          setDemo(keep.demo);
          setWatermark(keep.watermark);
          setUsedModel(keep.model);
          setResultDuration(keep.duration);
          setResultAspect(keep.aspectRatio);
          setResultResolution(keep.resolution);
          setLastCreditState(keep.creditState);
          setStatus("done");
        } else {
          setStatus("error");
        }
      } else {
        setStatus("error");
      }
      void refreshSession();
      return;
    }

    const data = result.data;
    if (data.session) {
      setSession((prev) =>
        prev ? { ...prev, ...data.session } : (data.session as MeResponse)
      );
    }
    setVideoUrl(data.videoUrl);
    setDemo(Boolean(data.demo));
    setWatermark(Boolean(data.watermark));
    setUsedModel(data.model || null);
    setResultDuration(
      typeof data.duration === "number" ? data.duration : effectiveDuration
    );
    setResultAspect(
      typeof data.aspectRatio === "string" ? data.aspectRatio : aspectRatio
    );
    setResultResolution(
      typeof data.resolution === "string" ? data.resolution : resolvedRes
    );
    const usedPreset = PRESETS.find((p) => p.slug === fx) ?? preset;
    const versionId =
      typeof data.requestId === "string" && data.requestId
        ? data.requestId
        : `v-${versions.length + 1}-${fx}-${resultDuration ?? effectiveDuration}`;
    const version: ResultVersion = {
      id: versionId,
      videoUrl: data.videoUrl,
      demo: Boolean(data.demo),
      watermark: Boolean(data.watermark),
      model: data.model || modelId,
      duration:
        typeof data.duration === "number" ? data.duration : effectiveDuration,
      aspectRatio:
        typeof data.aspectRatio === "string" ? data.aspectRatio : aspectRatio,
      resolution:
        typeof data.resolution === "string" ? data.resolution : resolvedRes,
      creditState: data.demo ? "0 cached" : "10 used",
      createdAt: new Date().toISOString(),
      sourceImage: img,
      requestId:
        typeof data.requestId === "string" ? data.requestId : undefined,
      provider: typeof data.provider === "string" ? data.provider : undefined,
      effect: fx,
      effectName: usedPreset.name,
    };
    setVersions((current) => [
      version,
      ...current.filter((item) => item.id !== version.id),
    ].slice(0, 8));
    setActiveVersionId(version.id);
    setLastCreditState(version.creditState);
    setStatus("done");
    rememberEffect(fx);
    pushHistory(
      historyFieldsFromSuccess(data, {
        effect: fx,
        effectName: usedPreset.name,
        fallbackDuration: effectiveDuration,
        fallbackAspect: aspectRatio,
        fallbackResolution: resolvedRes,
        sourceProject: opts?.labSampleId
          ? `lab-sample-${opts.labSampleId}`
          : remix.intent?.sourceProjectSlug,
        channel: remix.intent?.channel,
        projectId: localProjectId(
          img,
          opts?.labSampleId
            ? `lab-sample-${opts.labSampleId}`
            : remix.intent?.sourceProjectSlug
        ),
        projectName: opts?.labSampleId
          ? `PIKBO Lab sample · ${opts.labSampleId}`
          : remix.intent?.sourceProjectSlug
            ? `Remix · ${remix.intent.sourceProjectSlug}`
            : "Owned toy project",
        inputImage: img.length <= 300_000 ? img : undefined,
      })
    );
    emitSessionRefresh();
    toast(
      data.demo
        ? `${PROVENANCE.cachedDemo} ready`
        : `${PROVENANCE.liveGeneration} ready · saved to this browser`
    );
  }

  async function copyLink() {
    if (!videoUrl) return;
    try {
      await navigator.clipboard.writeText(videoUrl);
      setCopied(true);
      toast("Link copied");
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Could not copy link");
    }
  }

  function selectVersion(version: ResultVersion) {
    setActiveVersionId(version.id);
    setVideoUrl(version.videoUrl);
    setDemo(version.demo);
    setWatermark(version.watermark);
    setUsedModel(version.model);
    setResultDuration(version.duration);
    setResultAspect(version.aspectRatio);
    setResultResolution(version.resolution);
    setLastCreditState(version.creditState);
    // Do not overwrite the compose upload — Before/After uses version.sourceImage.
    setStatus("done");
    setError(null);
  }

  const activeVersion =
    versions.find((v) => v.id === activeVersionId) ?? versions[0] ?? null;
  /** Still tied to the active result version (honest A/B when switching Vn). */
  const compareStill = activeVersion?.sourceImage || image;

  function shareX() {
    if (!videoUrl) return;
    const text = encodeURIComponent(
      `Made with ${site.name} — ${preset.name} 🧸`
    );
    const url = encodeURIComponent(videoUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const busy = status === "generating" || status === "uploading";
  const canGenerate =
    !busy && mode === "i2v" && Boolean(image) && ownsRights;
  const primaryLabel = busy
    ? "Generating…"
    : !image
      ? "Add a toy photo first"
      : !ownsRights
        ? "Confirm ownership to continue"
        : demoMode
          ? "Generate · free cached demo"
          : !canAfford
            ? `Needs ${CREDITS_PER_VIDEO} credits`
            : isFree
              ? `Generate Mini trial · ${CREDITS_PER_VIDEO} credits`
              : `Generate · ${CREDITS_PER_VIDEO} credits`;

  // Path clarity for mobile: 1 photo → 2 recipe → 3 run → 4 result
  const pathStep: 1 | 2 | 3 | 4 =
    status === "done" && videoUrl
      ? 4
      : status === "generating"
        ? 3
        : image
          ? 2
          : 1;

  // Cmd/Ctrl + Enter to generate
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (canGenerate) void generate();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canGenerate,
    image,
    effect,
    effectiveDuration,
    aspectRatio,
    modelId,
    extra,
    mode,
    session,
    seed,
    resolution,
    ownsRights,
  ]);

  const featuredPresets = useMemo(() => {
    const heroes = [
      "360-spin-showcase",
      "blind-box-unboxing",
      "paparazzi-flash",
      "make-figure-dance",
      "floating-hero",
      "display-case-glam",
      "miniature-scene",
      "power-aura",
    ];
    const ordered = heroes
      .map((slug) => PRESETS.find((p) => p.slug === slug))
      .filter(Boolean) as typeof PRESETS;
    const rest = filteredPresets.filter(
      (p) => !heroes.includes(p.slug)
    );
    return presetFilter.trim() ? filteredPresets : [...ordered, ...rest];
  }, [filteredPresets, presetFilter]);

  return (
    <div className="flex h-full min-h-[calc(100vh-3.5rem)] flex-col pb-36 lg:min-h-screen lg:pb-0">
      {/* ── Mode banner: demo vs live impossible to miss (W5) ── */}
      <div
        role="status"
        className={`border-b px-4 py-2.5 ${
          demoMode
            ? "border-white/10 bg-white/[0.04]"
            : "border-[var(--mint)]/25 bg-[var(--mint)]/[0.08]"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                demoMode
                  ? "bg-white/10 text-white/80"
                  : "bg-[var(--mint)] text-black"
              }`}
            >
              {demoMode
                ? PROVENANCE.cachedDemo
                : isFree
                  ? "Live Mini trial"
                  : PROVENANCE.liveGeneration}
            </span>
            <p className="text-[11px] leading-snug text-[var(--fg-muted)] sm:text-xs">
              {demoMode ? (
                <>
                  Returns a Lab example · <b className="text-[var(--fg)]">does not use your photo</b> · 0 credits
                </>
              ) : (
                <>
                  Uses your photo · {isFree ? "Seedance Mini · 5s · 480p" : `${effectiveDuration}s · ${resolution}`} ·{" "}
                  {CREDITS_PER_VIDEO} credits
                  {creditsLeft !== null ? ` · ${creditsLeft} left` : ""} ·{" "}
                  <b className="text-[var(--fg)]">failed jobs refund</b>
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[var(--fg-muted)]">
            {session && (
              <span>
                <span className="font-semibold text-[var(--mint)]">
                  {session.credits}
                </span>{" "}
                · {session.planName}
              </span>
            )}
            <Link href="/pricing" className="text-[var(--mint)] hover:underline">
              Plans
            </Link>
          </div>
        </div>
      </div>

      {/* ── Remix context (from Home / project deep link) ── */}
      {(remix.sourceLabel || remix.notices.length > 0 || remix.intent) && (
        <div className="border-b border-[var(--mint)]/20 bg-[var(--mint)]/[0.06] px-4 py-3">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
            {remix.sourcePoster && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={remix.sourcePoster}
                alt=""
                className="h-14 w-10 shrink-0 rounded-md object-cover ring-1 ring-white/15"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-[var(--mint)]">
                Remix this recipe · replace the toy
              </p>
              <p className="text-sm font-semibold text-[var(--fg)]">
                {remix.sourceLabel || preset.name}
                {remix.intent?.channel ? (
                  <span className="ml-2 text-[11px] font-normal text-[var(--fg-muted)]">
                    · {remix.intent.channel} · {remix.intent.aspectRatio} ·{" "}
                    {remix.intent.durationSeconds}s
                  </span>
                ) : null}
              </p>
              <p className="text-[11px] text-[var(--fg-muted)]">
                Upload a photo of a toy you own. The example does not become
                your output until live generation runs on your image.
              </p>
              {remix.notices.map((n) => (
                <p key={n} className="text-[11px] text-amber-200/90">
                  {n}
                </p>
              ))}
            </div>
            {initialSource && (
              <Link
                href={`/projects/${encodeURIComponent(initialSource)}`}
                className="text-[11px] font-semibold text-[var(--mint)] hover:underline"
              >
                Inside recipe →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile path steps (390px craft) ── */}
      <div className="border-b border-[var(--border)] px-4 py-2 lg:hidden">
        <ol className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide">
          {(
            [
              { n: 1 as const, label: "Photo" },
              { n: 2 as const, label: "Recipe" },
              { n: 3 as const, label: "Generate" },
              { n: 4 as const, label: "Result" },
            ] as const
          ).map((s, i) => (
            <li key={s.n} className="flex flex-1 items-center gap-1">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] ${
                  pathStep >= s.n
                    ? "bg-[var(--mint)] text-black"
                    : "bg-white/10 text-white/40"
                }`}
              >
                {s.n}
              </span>
              <span
                className={
                  pathStep >= s.n ? "text-[var(--fg)]" : "text-[var(--fg-dim)]"
                }
              >
                {s.label}
              </span>
              {i < 3 && (
                <span className="mx-0.5 flex-1 border-t border-white/10" aria-hidden />
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid flex-1 lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* ── Recipe rail (desktop) / horizontal chips (mobile, in controls) ── */}
        <aside className="hidden max-h-none overflow-y-auto border-r border-[var(--border)] p-3 lg:block">
          <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wider text-[var(--fg-dim)]">
            Toy recipes
          </p>
          <input
            value={presetFilter}
            onChange={(e) => setPresetFilter(e.target.value)}
            placeholder="Search spin, unbox…"
            className="mb-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-2.5 py-1.5 text-xs outline-none focus:border-[var(--brand)]"
          />
          {favorites.length > 0 && !presetFilter && (
            <div className="mb-2">
              <p className="mb-1 px-1 text-[9px] font-bold uppercase text-[var(--fg-dim)]">
                ★ Favorites
              </p>
              <div className="flex flex-wrap gap-1">
                {favorites.map((slug) => {
                  const p = PRESETS.find((x) => x.slug === slug);
                  if (!p) return null;
                  return (
                    <button
                      key={`fav-${slug}`}
                      type="button"
                      onClick={() => selectEffect(slug)}
                      className="rounded-md border border-[var(--brand)]/40 px-1.5 py-0.5 text-[10px]"
                    >
                      {p.emoji} {p.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1">
            {featuredPresets.map((p) => (
              <div
                key={p.slug}
                className={`flex items-stretch gap-1 rounded-xl border ${
                  effect === p.slug
                    ? "border-[var(--mint)] bg-[var(--card)]"
                    : "border-transparent bg-[var(--bg-soft)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectEffect(p.slug)}
                  className="flex flex-1 items-center gap-2 p-2.5 text-left text-sm"
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-lg"
                    style={{ background: p.gradient }}
                  >
                    {p.emoji}
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[11px] font-bold tracking-wide">
                      {viralName(p.slug, p.name)}
                    </span>
                    <span className="block text-[10px] text-[var(--fg-dim)]">
                      {p.duration}s · {p.aspectRatio}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  title="Favorite"
                  className="px-2 text-xs text-[var(--fg-dim)] hover:text-[var(--brand)]"
                  onClick={() => setFavorites(toggleFavorite(p.slug))}
                >
                  {favorites.includes(p.slug) ? "★" : "☆"}
                </button>
              </div>
            ))}
            {featuredPresets.length === 0 && (
              <p className="px-1 text-xs text-[var(--fg-dim)]">No presets match</p>
            )}
          </div>
          <Link
            href="/create?mode=seller-pack"
            className="mt-3 block rounded-xl border border-[var(--mint)]/30 bg-[var(--mint)]/[0.06] px-3 py-2.5 text-[11px] leading-snug text-[var(--fg-muted)] transition hover:border-[var(--mint)]/50"
          >
            <span className="font-bold text-[var(--mint)]">Seller Pack · 3 outputs</span>
            <span className="mt-0.5 block text-[10px] text-[var(--fg-dim)]">
              Listing spin + reveal + social hook from one photo
            </span>
          </Link>
        </aside>

        {/* ── Controls: upload → recipe → preflight ── */}
        <section className="space-y-4 overflow-y-auto border-b border-[var(--border)] p-4 lg:border-b-0 lg:border-r">
          {upgradedBanner && (
            <div className="rounded-xl border border-[var(--mint)]/40 bg-[color-mix(in_srgb,var(--mint)_10%,transparent)] px-3 py-2 text-xs">
              Paid allowance active — 720p path, no on-player watermark.
            </div>
          )}

          {showUnknownNotice && (
            <div className="flex items-start justify-between gap-2 rounded-xl border border-amber-400/40 bg-amber-400/[0.08] px-3 py-2 text-xs text-amber-200">
              <span>
                The recipe <b>“{initialEffect}”</b> isn’t available — showing{" "}
                <b>{preset.name}</b> instead. Pick any recipe below.
              </span>
              <button
                type="button"
                onClick={() => setShowUnknownNotice(false)}
                className="shrink-0 text-amber-200/70 hover:text-amber-100"
                aria-label="Dismiss notice"
              >
                ✕
              </button>
            </div>
          )}

          {/* Step 1 — Photo */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wide text-[var(--fg-muted)]">
                <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--mint)] text-[9px] text-black lg:hidden">
                  1
                </span>
                Your toy photo
              </label>
              {image && (
                <button
                  type="button"
                  className="text-[10px] font-semibold text-[var(--fg-dim)] hover:text-[var(--brand)]"
                  onClick={() => setImage(null)}
                >
                  Replace
                </button>
              )}
            </div>
            <label
              className={`flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed bg-[var(--bg-soft)] transition-colors hover:border-[var(--mint)]/50 ${
                image
                  ? "aspect-[16/10] border-[var(--border)]"
                  : "min-h-[160px] border-[var(--mint)]/35 sm:aspect-video"
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt="your toy"
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="px-6 text-center text-sm text-[var(--fg-dim)]">
                  <span className="mb-2 block text-2xl" aria-hidden>
                    🧸
                  </span>
                  Drop a photo of a figure you own
                  <br />
                  <span className="text-xs">
                    or tap · JPEG / PNG / WebP / GIF · under ~8 MB
                  </span>
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFile}
              />
            </label>
            {!image && (
              <div className="mt-3 rounded-2xl border border-[var(--mint)]/25 bg-[var(--mint)]/[0.06] p-3">
                <p className="text-sm font-bold text-[var(--fg)]">
                  No photo? Try an official Lab sample
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--fg-muted)]">
                  Official Pikbo stills (not a customer upload). Cached demos
                  cost 0 credits; live Mini uses 10 when the provider is on.
                  One tap loads the recipe and starts generate.
                </p>
                <button
                  type="button"
                  disabled={sampleLoading || busy}
                  onClick={() => void loadSampleToy("scout", true)}
                  className="btn btn-primary mt-3 w-full py-3 text-sm disabled:opacity-50"
                >
                  {sampleLoading || busy
                    ? "Working…"
                    : demoMode
                      ? "▶  One tap · free cached sample"
                      : "▶  One tap · Mini sample (10 credits)"}
                </button>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {SAMPLE_TOYS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      disabled={sampleLoading || busy}
                      className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)] text-left transition hover:border-[var(--mint)] disabled:opacity-50"
                      onClick={() => void loadSampleToy(s.id, true)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.path}
                        alt={s.label}
                        className="aspect-square w-full object-cover transition group-hover:scale-[1.03]"
                      />
                      <span className="block px-2 py-1.5 text-[11px] font-bold">
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
                {sampleLoading && (
                  <p className="mt-2 text-[11px] text-[var(--mint)]">
                    Loading sample…
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Step 2 — Recipe (mobile chips; desktop uses rail) */}
          <div className="lg:hidden">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--fg-muted)]">
              <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--mint)] text-[9px] text-black">
                2
              </span>
              Recipe
            </p>
            <input
              value={presetFilter}
              onChange={(e) => setPresetFilter(e.target.value)}
              placeholder="Search spin, unbox…"
              className="mb-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-2.5 py-2 text-xs outline-none focus:border-[var(--brand)]"
            />
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {featuredPresets.slice(0, 16).map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => selectEffect(p.slug)}
                  className={`min-w-[118px] shrink-0 rounded-xl border px-2.5 py-2.5 text-left transition ${
                    effect === p.slug
                      ? "border-[var(--mint)] bg-[var(--mint)]/10 ring-1 ring-[var(--mint)]/40"
                      : "border-[var(--border)] bg-[var(--bg-soft)]"
                  }`}
                >
                  <span className="text-base">{p.emoji}</span>
                  <span className="mt-1 block text-[11px] font-bold leading-tight">
                    {viralName(p.slug, p.name)}
                  </span>
                  <span className="mt-0.5 block text-[9px] text-[var(--fg-dim)]">
                    {p.aspectRatio}
                  </span>
                </button>
              ))}
            </div>
            <Link
              href="/create?mode=seller-pack"
              className="mt-2 inline-flex text-[11px] font-semibold text-[var(--mint)] hover:underline"
            >
              Need 3 seller formats? Seller Pack →
            </Link>
          </div>

          {/* Active recipe summary + aspect (essential only) */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--fg-dim)]">
                  Selected recipe
                </p>
                <p className="mt-0.5 text-sm font-bold">
                  {preset.emoji} {viralName(preset.slug, preset.name)}
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--fg-dim)]">
                  {preset.tagline}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-[var(--fg-dim)]">
                {effectiveDuration}s · {isFree ? "480p" : resolution}
              </span>
            </div>
            <div className="mt-3">
              <p className="mb-1.5 text-[10px] font-semibold text-[var(--fg-dim)]">
                Aspect
              </p>
              <div className="flex gap-2">
                {(
                  [
                    { id: "9:16" as const, label: "9:16" },
                    { id: "1:1" as const, label: "1:1" },
                    { id: "16:9" as const, label: "16:9" },
                  ] as const
                ).map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAspectRatio(a.id)}
                    className={`flex-1 rounded-lg border py-2 text-[11px] font-semibold ${
                      aspectRatio === a.id
                        ? "border-[var(--mint)] bg-[var(--mint)]/10 text-[var(--mint)]"
                        : "border-[var(--border)] text-[var(--fg-muted)]"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced — models, duration, seed, prompt (collapsed) */}
          <div className="rounded-xl border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex w-full items-center justify-between px-3 py-2.5 text-left text-xs font-semibold text-[var(--fg-muted)]"
            >
              Advanced
              <span className="text-[10px] text-[var(--fg-dim)]">
                {showAdvanced ? "Hide" : "Duration · model · prompt"}
              </span>
            </button>
            {showAdvanced && (
              <div className="space-y-3 border-t border-[var(--border)] p-3">
                <div>
                  <p className="text-[10px] font-semibold text-[var(--fg-dim)]">
                    Duration
                  </p>
                  <div className="mt-1.5 flex gap-2">
                    {([5, 10] as const).map((d) => {
                      const freeLock = Boolean(isFree && d === 10);
                      return (
                        <button
                          key={d}
                          type="button"
                          disabled={freeLock}
                          onClick={() => {
                            if (freeLock) {
                              setShowPaywall(true);
                              return;
                            }
                            setDuration(d);
                          }}
                          className={`flex-1 rounded-lg border py-2 text-sm font-semibold ${
                            effectiveDuration === d
                              ? "border-[var(--brand)] bg-[var(--grad-soft)]"
                              : "border-[var(--border)] text-[var(--fg-muted)]"
                          } ${freeLock ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          {d}s{freeLock ? " · paid" : ""}
                        </button>
                      );
                    })}
                  </div>
                  {isFree && (
                    <p className="mt-1 text-[10px] text-[var(--fg-dim)]">
                      Free trial locked to Mini · 5s · 480p · on-player mark
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-[var(--fg-dim)]">
                    Resolution
                  </p>
                  <div className="mt-1.5 flex gap-2">
                    {(["480p", "720p"] as const).map((r) => {
                      const locked = Boolean(isFree && r === "720p");
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            if (locked) {
                              setShowPaywall(true);
                              setError("720p is on paid plans.");
                              return;
                            }
                            setResolution(r);
                          }}
                          className={`flex-1 rounded-lg border py-2 text-sm font-semibold ${
                            (isFree ? "480p" : resolution) === r
                              ? "border-[var(--brand)] bg-[var(--grad-soft)]"
                              : "border-[var(--border)] text-[var(--fg-muted)]"
                          } ${locked ? "opacity-60" : ""}`}
                        >
                          {r}
                          {locked ? " · paid" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-[var(--fg-dim)]">
                    Model
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {MODELS.map((m) => {
                      const lockedPaid = Boolean(isFree && !m.free);
                      const active = modelId === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            if (lockedPaid) {
                              setShowPaywall(true);
                              setError(
                                "Paid models are locked — Free live jobs use Seedance Mini at 480p."
                              );
                              setModelId("seedance-mini");
                              return;
                            }
                            setModelId(m.id);
                          }}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                            active
                              ? "border-[var(--mint)] bg-[var(--mint)]/15 text-[var(--mint)]"
                              : "border-[var(--border)] text-[var(--fg-muted)]"
                          } ${lockedPaid ? "opacity-60" : ""}`}
                        >
                          {m.label}
                          {lockedPaid ? " · paid" : m.free ? " · free" : ""}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-1 text-[10px] text-[var(--fg-dim)]">
                    Soft launch enforces Mini for free live jobs. No fake multi-model shelf.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[10px] font-semibold text-[var(--fg-dim)]">
                      Seed (optional)
                    </label>
                    <button
                      type="button"
                      className="text-[10px] text-[var(--fg-dim)] hover:text-[var(--fg)]"
                      onClick={() =>
                        setSeed(
                          String(Math.floor(Math.random() * 1_000_000_000))
                        )
                      }
                    >
                      Random
                    </button>
                  </div>
                  <input
                    value={seed}
                    onChange={(e) =>
                      setSeed(e.target.value.replace(/[^\d]/g, ""))
                    }
                    placeholder="Empty = random"
                    className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-semibold text-[var(--fg-dim)]">
                      Motion prompt
                    </label>
                    <button
                      type="button"
                      className="text-[10px] text-[var(--brand)] hover:underline"
                      onClick={() => setExtra(preset.promptTemplate)}
                    >
                      Reset to preset
                    </button>
                  </div>
                  <textarea
                    value={extra || preset.promptTemplate}
                    onChange={(e) => setExtra(e.target.value)}
                    rows={4}
                    className="mt-1.5 w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)]"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {[
                      "slow turntable",
                      "soft studio light",
                      "keep paint sharp",
                      "subtle float",
                      "no morph face",
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--fg-dim)] hover:border-[var(--brand)] hover:text-[var(--fg)]"
                        onClick={() => {
                          const base = extra || preset.promptTemplate;
                          setExtra(`${base} ${chip}.`);
                        }}
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preflight + rights + primary (desktop; mobile sticky below) */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-3 text-xs">
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-wider text-[var(--fg-dim)]">
              <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--mint)] text-[9px] text-black lg:hidden">
                3
              </span>
              Before you generate
            </p>
            {demoMode ? (
              <p className="text-[var(--fg-muted)]">
                <b className="text-[var(--fg)]">{PROVENANCE.cachedDemo}</b> — does not use
                your upload · costs 0 credits
              </p>
            ) : (
              <div className="space-y-1 text-[var(--fg-muted)]">
                <p>
                  <b className="text-[var(--fg)]">
                    {isFree ? "Live Mini trial" : PROVENANCE.liveGeneration}
                  </b>{" "}
                  — uses your photo · {isFree ? "Seedance Mini · " : ""}
                  {effectiveDuration}s · {isFree ? "480p" : resolution} ·{" "}
                  {aspectRatio}
                </p>
                <p className="text-[var(--fg-dim)]">
                  Costs {CREDITS_PER_VIDEO} credits
                  {creditsLeft !== null ? ` · ${creditsLeft} left` : ""} · fal.ai /
                  Seedance · <b className="text-[var(--fg)]">failed jobs refund</b>
                </p>
              </div>
            )}
          </div>

          <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2.5 text-[11px] leading-snug text-[var(--fg-muted)]">
            <input
              type="checkbox"
              checked={ownsRights}
              onChange={(e) => setOwnsRights(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--mint)]"
            />
            <span>
              I own this photo and have the right to animate and publish this toy
              or character. Pikbo grants no third-party IP rights.
            </span>
          </label>

          <button
            type="button"
            onClick={() => void generate()}
            disabled={!canGenerate}
            className="btn btn-primary hidden w-full disabled:opacity-50 lg:flex"
          >
            {primaryLabel}
          </button>

          {(error || lastRefunded) && (
            <div
              role="alert"
              className={`rounded-xl border px-3 py-2.5 text-sm ${
                lastRefunded
                  ? "border-amber-400/40 bg-amber-400/[0.08] text-amber-100"
                  : lastCreditState === "refund unconfirmed"
                    ? "border-amber-300/30 bg-amber-300/[0.06] text-amber-100"
                  : "border-[var(--brand)]/40 bg-[var(--brand)]/10 text-[var(--brand)]"
              }`}
            >
              <p className="font-semibold">{error}</p>
              {lastRefunded && (
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-amber-200/90">
                  10 credits restored · not charged for this failed job
                </p>
              )}
              {lastCreditState === "refund unconfirmed" ? (
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-amber-200/90">
                  Refund unconfirmed · check your balance before retrying
                </p>
              ) : null}
            </div>
          )}

          {showPaywall && (
            <PaywallCard title="Allowance used up — compare finite plans" />
          )}
        </section>

        {/* ── Result panel ── */}
        <section
          id="create-result"
          className={`flex flex-col bg-[var(--bg-soft)] p-4 ${
            status === "done" || status === "generating" ? "order-first lg:order-none" : ""
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--mint)] text-[9px] text-black lg:hidden">
                4
              </span>
              Result
            </h2>
            <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--fg-dim)]">
              {usedModel || MODELS.find((m) => m.id === modelId)?.label}
            </span>
          </div>
          <div className="relative flex min-h-[280px] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-[var(--mint)]/15 bg-black bg-[radial-gradient(120%_80%_at_50%_0%,rgba(200,255,61,0.07),transparent_60%)] ring-1 ring-inset ring-white/5 sm:min-h-[400px]">
            {status === "generating" && (
              <div className="p-8 text-center text-[var(--fg-muted)] sm:p-10">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--mint)]" />
                <p className="font-medium text-[var(--fg)]">
                  {demoMode ? "Loading cached demo…" : "Animating your figure…"}
                </p>
                <p className="mt-1 text-xs text-[var(--fg-dim)]">
                  {demoMode
                    ? "Lab example — not from your upload"
                    : elapsed < 3
                      ? "Uploading reference"
                      : elapsed < 12
                        ? "Seedance queue"
                        : elapsed < 35
                          ? "Rendering motion"
                          : "Almost done — large clips take longer"}
                  {" · "}
                  {elapsed}s
                </p>
                <div className="mx-auto mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-[var(--border)]">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(95, 8 + elapsed * 2.2)}%`,
                      background: "var(--grad)",
                    }}
                  />
                </div>
              </div>
            )}
            {(status === "done" || status === "error") && videoUrl && (
              <div className="relative w-full p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                        demo
                          ? "border border-white/20 bg-white/15 text-white"
                          : "border border-[var(--mint)]/40 bg-[var(--mint)] text-black"
                      }`}
                    >
                      {resultProvenanceLabel(demo)}
                    </span>
                    {watermark && (
                      <span className="rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/70">
                        {PROVENANCE.onPlayerMark}
                      </span>
                    )}
                    {lastCreditState ? (
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          lastCreditState === "refund unconfirmed"
                            ? "border-amber-300/30 bg-amber-300/10 text-amber-100"
                            : "border-white/10 bg-black/40 text-white/60"
                        }`}
                      >
                        {lastCreditState}
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCompare((c) => !c)}
                    className="text-[10px] font-semibold text-[var(--brand)] hover:underline"
                  >
                    {compare ? "Video only" : "Photo ↔ video"}
                  </button>
                </div>
                {versions.length > 0 ? (
                  <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <span className="shrink-0 text-[10px] font-black uppercase tracking-wide text-[var(--fg-dim)]">
                      Versions
                    </span>
                    {versions.map((version, index) => (
                      <button
                        key={version.id}
                        type="button"
                        onClick={() => selectVersion(version)}
                        className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold ${
                          activeVersionId === version.id
                            ? "border-[var(--mint)] bg-[var(--mint)]/10 text-[var(--mint)]"
                            : "border-[var(--border)] text-[var(--fg-muted)]"
                        }`}
                        title={`${version.effectName || version.effect} · ${version.creditState}`}
                      >
                        V{versions.length - index} · {version.creditState}
                      </button>
                    ))}
                  </div>
                ) : null}
                {compare && compareStill ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 text-center text-[10px] font-bold uppercase text-[var(--fg-dim)]">
                        Before
                        {activeVersion
                          ? ` · ${activeVersion.effectName || activeVersion.effect}`
                          : ""}
                      </p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={compareStill}
                        alt="before"
                        className="mx-auto max-h-[45vh] rounded-lg object-contain"
                      />
                    </div>
                    <div className="relative">
                      <p className="mb-1 text-center text-[10px] font-bold uppercase text-[var(--fg-dim)]">
                        After · server output
                      </p>
                      <video
                        key={videoUrl}
                        src={videoUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="mx-auto max-h-[45vh] rounded-lg"
                      />
                      {watermark && (
                        <div
                          className="pointer-events-none absolute bottom-3 right-3 rounded-md px-2 py-1 text-[10px] font-bold text-white/90"
                          style={{ background: "var(--grad)" }}
                        >
                          {site.name}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      key={videoUrl}
                      src={videoUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="mx-auto max-h-[65vh] rounded-lg"
                    />
                    {watermark && (
                      <div
                        className="pointer-events-none absolute bottom-6 right-6 rounded-md px-2 py-1 text-xs font-bold text-white/90"
                        style={{ background: "var(--grad)" }}
                      >
                        {site.name}
                      </div>
                    )}
                  </div>
                )}
                <div className="mx-auto mt-3 max-w-md rounded-2xl border border-[var(--mint)]/30 bg-[var(--mint)]/[0.07] px-4 py-3 text-center">
                  <p className="text-sm font-black text-[var(--fg)]">
                    {demo ? "Preview ready ✨" : "Your clip is ready ✨"}
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[var(--fg-muted)]">
                    {demo
                      ? "This is a free labeled demo — it shows the recipe style. Live mode uses your real toy photo."
                      : "Save it, post it, or make another version. Retry appends a new version — prior clips stay switchable."}
                  </p>
                </div>
                <p className="mx-auto mt-2 max-w-md text-center text-[11px] leading-relaxed text-[var(--fg-dim)]">
                  {demo
                    ? `${PROVENANCE.cachedDemo} — does not animate your upload.`
                    : `${PROVENANCE.liveGeneration} — each run creates a separate version. Returned provider failures restore credits; ambiguous network results are marked unconfirmed.`}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <a
                    href={videoUrl}
                    download={`pikbo-${activeVersion?.effect || effect}.mp4`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary px-4 py-2 text-xs"
                  >
                    Download · keep it
                  </a>
                  <button
                    type="button"
                    onClick={copyLink}
                    className="btn btn-ghost px-4 py-2 text-xs"
                  >
                    {copied ? "Copied!" : "Copy link"}
                  </button>
                  <button
                    type="button"
                    onClick={shareX}
                    className="btn btn-ghost px-4 py-2 text-xs"
                  >
                    Share on X
                  </button>
                  <button
                    type="button"
                    onClick={() => void generate()}
                    className="btn btn-ghost px-4 py-2 text-xs"
                  >
                    Retry · new version
                  </button>
                  <button
                    type="button"
                    onClick={() => void generate()}
                    className="btn btn-ghost px-4 py-2 text-xs"
                  >
                    Make variant
                  </button>
                  <Link
                    href="/effects"
                    className="btn btn-ghost px-4 py-2 text-xs"
                  >
                    Another recipe
                  </Link>
                  {remix.intent?.sourceProjectSlug ? (
                    <Link
                      href={`/projects/${encodeURIComponent(remix.intent.sourceProjectSlug)}`}
                      className="btn btn-ghost px-4 py-2 text-xs"
                    >
                      Open source recipe
                    </Link>
                  ) : null}
                  <Link
                    href="/library"
                    className="btn btn-ghost px-4 py-2 text-xs"
                  >
                    Saved to Library
                  </Link>
                  <Link
                    href="/create?mode=seller-pack"
                    className="btn btn-ghost px-4 py-2 text-xs"
                  >
                    Seller Pack
                  </Link>
                </div>

                {/* Wave A: server-returned metadata for the active version */}
                <dl className="mx-auto mt-4 grid max-w-lg grid-cols-2 gap-x-4 gap-y-1.5 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[11px] sm:grid-cols-3">
                  <div>
                    <dt className="text-[var(--fg-dim)]">Recipe</dt>
                    <dd className="font-semibold text-[var(--fg)]">
                      {activeVersion?.effectName || preset.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--fg-dim)]">Model</dt>
                    <dd className="font-semibold text-[var(--fg)]">
                      {(
                        usedModel ||
                        MODELS.find((m) => m.id === modelId)?.label ||
                        "—"
                      )
                        .toString()
                        .split("/")
                        .pop()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--fg-dim)]">Duration</dt>
                    <dd className="font-semibold text-[var(--fg)]">
                      {resultDuration ?? effectiveDuration}s
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--fg-dim)]">Aspect</dt>
                    <dd className="font-semibold text-[var(--fg)]">
                      {resultAspect ?? aspectRatio}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--fg-dim)]">Resolution</dt>
                    <dd className="font-semibold text-[var(--fg)]">
                      {resultResolution ?? (isFree ? "480p" : resolution)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--fg-dim)]">Credits</dt>
                    <dd className="font-semibold text-[var(--fg)]">
                      {lastCreditState || (demo ? "0 cached" : "10 used")}
                    </dd>
                  </div>
                  {activeVersion?.provider ? (
                    <div>
                      <dt className="text-[var(--fg-dim)]">Provider</dt>
                      <dd className="font-semibold text-[var(--fg)]">
                        {activeVersion.provider}
                      </dd>
                    </div>
                  ) : null}
                  {activeVersion?.requestId ? (
                    <div className="col-span-2 sm:col-span-3">
                      <dt className="text-[var(--fg-dim)]">Task ID</dt>
                      <dd className="truncate font-mono text-[10px] text-[var(--fg-muted)]">
                        {activeVersion.requestId}
                      </dd>
                    </div>
                  ) : null}
                </dl>
                <p className="mt-2 text-center text-[10px] text-[var(--fg-dim)]">
                  Metadata is what the server returned for this version — not a
                  client-side guess.
                  {versions.length > 1
                    ? ` · ${versions.length} versions in this session`
                    : ""}
                </p>
                <p className="mt-1 text-center text-[10px] text-[var(--fg-dim)]">
                  {demo
                    ? `${PROVENANCE.cachedDemo} only — not from your upload · not cloud-backed`
                    : localLibraryNote()}
                </p>
              </div>
            )}
            {status === "generating" && !videoUrl && (
              <div className="flex flex-col items-center p-10 text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-[var(--mint)] border-t-transparent" />
                <p className="mt-5 font-display text-lg font-bold uppercase tracking-tight text-white">
                  Making your clip… {elapsed}s
                </p>
                <p className="mt-2 max-w-xs text-xs text-[var(--fg-muted)]">
                  Live jobs take a bit. Cached demos come back faster.
                </p>
              </div>
            )}
            {(status === "idle" || status === "error") && !videoUrl && (
              <div className="flex flex-col items-center p-8 text-center sm:p-10">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-[var(--mint)]/30 bg-[var(--mint)]/[0.06] text-[var(--mint)] sm:h-16 sm:w-16">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                </span>
                <p className="mt-4 font-display text-base font-bold uppercase tracking-tight text-white sm:text-lg">
                  Your clip lands here
                </p>
                <p className="mt-1.5 max-w-xs text-xs text-[var(--fg-muted)]">
                  {image
                    ? "Hit the green Generate button — one primary action."
                    : demoMode
                      ? "No photo? One-tap official Lab sample (cached · free)."
                      : "No photo? One-tap official Lab sample (live Mini · 10 credits)."}
                </p>
                {!image && (
                  <button
                    type="button"
                    disabled={sampleLoading || busy}
                    onClick={() => void loadSampleToy("scout", true)}
                    className="btn btn-primary mt-5 px-6 py-2.5 text-sm disabled:opacity-50"
                  >
                    {demoMode
                      ? "▶ Lab sample · free"
                      : "▶ Lab sample · Mini trial"}
                  </button>
                )}
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--mint)]/25 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--mint)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--mint)]" />
                  {aspectRatio} · {effectiveDuration}s
                </span>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── Sticky mobile primary CTA — sits above AppShell bottom tab nav ── */}
      <div className="fixed inset-x-0 bottom-[4.75rem] z-40 border-t border-white/10 bg-black/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => {
            void generate();
            if (status === "generating" || canGenerate) {
              document
                .getElementById("create-result")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          disabled={!canGenerate}
          className="btn btn-primary w-full py-3 text-sm disabled:opacity-50"
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
}
