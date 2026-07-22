"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { loadFavorites, toggleFavorite } from "@/lib/favorites";
import { pushHistory } from "@/lib/history";
import { SAMPLE_TOYS, sampleToDataUrl } from "@/lib/samples";
import { PRESETS } from "@/lib/presets";
import { viralName } from "@/lib/viralNames";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import type { PublicSession } from "@/lib/session";
import { site } from "@/lib/site";
import { useToast } from "@/components/Toast";
import { PaywallCard } from "@/components/PaywallCard";
import { emitSessionRefresh } from "@/lib/sessionEvents";

type Status = "idle" | "uploading" | "generating" | "done" | "error";
type Mode = "i2v" | "t2v";

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
}: {
  initialEffect?: string;
  initialModel?: string;
  initialMode?: Mode;
  initialPrompt?: string;
}) {
  const bootPreset =
    PRESETS.find((p) => p.slug === initialEffect) ?? PRESETS[0];
  const [mode, setMode] = useState<Mode>(initialMode ?? "i2v");
  const [modelId, setModelId] = useState<(typeof MODELS)[number]["id"]>(() => {
    if (initialModel === "seedance-mini") return "seedance-mini";
    if (initialModel === "seedance-fast") return "seedance-fast";
    if (initialModel === "seedance-2") return "seedance-2";
    return "seedance-mini";
  });
  const [effect, setEffect] = useState(bootPreset.slug);
  const [image, setImage] = useState<string | null>(null);
  const [extra, setExtra] = useState(initialPrompt ?? "");
  const [duration, setDuration] = useState<5 | 10>(
    bootPreset.duration === 10 ? 10 : 5
  );
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9" | "1:1">(
    bootPreset.aspectRatio === "16:9" || bootPreset.aspectRatio === "1:1"
      ? bootPreset.aspectRatio
      : "9:16"
  );
  const [status, setStatus] = useState<Status>("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [watermark, setWatermark] = useState(true);
  const [session, setSession] = useState<PublicSession | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [upgradedBanner, setUpgradedBanner] = useState(false);
  const [usedModel, setUsedModel] = useState<string | null>(null);
  const [presetFilter, setPresetFilter] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState(true);
  const [resolution, setResolution] = useState<"480p" | "720p">("720p");
  const [seed, setSeed] = useState<string>("");
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

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem("pikbo_recent_effects");
        if (raw) setRecent(JSON.parse(raw) as string[]);
      } catch {
        // ignore
      }
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

  useEffect(() => {
    if (status !== "generating") return;
    const t0 = Date.now();
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - t0) / 1000));
    }, 250);
    return () => window.clearInterval(id);
  }, [status]);

  function rememberEffect(slug: string) {
    setRecent((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, 6);
      try {
        localStorage.setItem("pikbo_recent_effects", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/me");
      const data = (await res.json()) as PublicSession;
      setSession(data);
      setWatermark(data.watermark);
      // Free path: Mini (cheapest wool) + 480p
      if (data.plan === "free" || data.watermark) {
        setModelId("seedance-mini");
        setResolution("480p");
      }
    } catch {
      // ignore
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
  // Free tier is hard-locked to 5s server-side; keep UI in sync without an effect.
  const effectiveDuration = isFree ? 5 : duration;

  async function generate() {
    if (mode === "t2v") {
      setError(
        "Text→Video is on the roadmap. Photo → video is the product core — upload a toy still."
      );
      setMode("i2v");
      return;
    }
    if (!image) {
      setError("Upload a reference image first (image-to-video).");
      return;
    }
    if (image.length > 12_000_000) {
      setError("Image is too large. Use a photo under ~8MB.");
      return;
    }
    if (session && session.credits < CREDITS_PER_VIDEO) {
      setShowPaywall(true);
      setError("Not enough credits.");
      return;
    }

    setError(null);
    setVideoUrl(null);
    setShowPaywall(false);
    setElapsed(0);
    setStatus("generating");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          effect,
          image,
          extra,
          duration: effectiveDuration,
          aspectRatio,
          model: modelId,
          resolution: isFree ? "480p" : resolution,
          seed: seed.trim() === "" ? undefined : Number(seed),
        }),
      });
      const data = await res.json();
      if (data.session) setSession(data.session);

      if (res.status === 402 || data.code === "INSUFFICIENT_CREDITS") {
        setShowPaywall(true);
        setError(
          data.error || "This allowance is used up. Compare finite plans to continue."
        );
        setStatus("error");
        return;
      }
      if (res.status === 429 || data.code === "RATE_LIMITED") {
        setError(data.error || "Too many generates — wait a moment.");
        setStatus("error");
        return;
      }
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setVideoUrl(data.videoUrl);
      setDemo(Boolean(data.demo));
      setWatermark(Boolean(data.watermark));
      setUsedModel(data.model || null);
      setStatus("done");
      rememberEffect(effect);
      pushHistory({
        videoUrl: data.videoUrl,
        effect,
        effectName: preset.name,
        model: data.model,
        watermark: Boolean(data.watermark),
        demo: Boolean(data.demo),
      });
      emitSessionRefresh();
      toast(data.demo ? "Cached demo ready" : "Live clip ready · saved to Library");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
      refreshSession();
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
      setError("Could not copy link");
    }
  }

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

  // Cmd/Ctrl + Enter to generate
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (!busy) void generate();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    busy,
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
  ]);

  return (
    <div className="flex h-full min-h-[calc(100vh-3.5rem)] flex-col lg:min-h-screen">
      {/* Top toolbar — model / mode like big AI apps */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3">
        <div className="flex rounded-full border border-[var(--border)] p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode("i2v")}
            className={`rounded-full px-3 py-1.5 font-semibold ${
              mode === "i2v"
                ? "bg-[var(--card)] text-[var(--fg)]"
                : "text-[var(--fg-dim)]"
            }`}
          >
            Image → Video
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("t2v");
              toast("Text→Video is next — toy photo → Seedance is the supported workflow");
            }}
            className={`rounded-full px-3 py-1.5 font-semibold ${
              mode === "t2v"
                ? "bg-[var(--card)] text-[var(--fg)]"
                : "text-[var(--fg-dim)]"
            }`}
            title="Roadmap — photo-first is the supported path"
          >
            Text → Video
            <span className="ml-1 text-[9px] font-normal opacity-70">soon</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden text-[10px] font-bold uppercase tracking-wider text-[var(--fg-dim)] sm:inline">
            Model
          </span>
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
                    setError("Paid models are locked — Free live jobs use Seedance Mini at 480p.");
                    setModelId("seedance-mini");
                    return;
                  }
                  setModelId(m.id);
                }}
                className={`rounded-full border px-3.5 py-1.5 text-left text-xs transition-colors ${
                  active
                    ? "border-[var(--mint)] bg-[var(--mint)]/15 text-[var(--mint)] ring-1 ring-[var(--mint)]/40"
                    : "border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:border-[var(--fg-dim)]"
                } ${lockedPaid ? "opacity-70" : ""}`}
              >
                <span className="font-semibold">
                  {m.label}
                  {lockedPaid ? " · paid" : m.free ? " · free" : ""}
                </span>
                <span className="ml-1.5 hidden text-[10px] text-[var(--fg-dim)] sm:inline">
                  {m.vendor}
                </span>
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-3 text-xs text-[var(--fg-muted)]">
          {session && (
            <span>
              <span className="font-semibold text-[var(--mint)]">
                {session.credits}
              </span>{" "}
              credits · {session.planName}
            </span>
          )}
          <Link href="/pricing" className="text-[var(--mint)] hover:underline">
            Upgrade
          </Link>
        </div>
      </div>

      <div className="grid flex-1 lg:grid-cols-[280px_1fr_1.1fr]">
        {/* Preset rail */}
        <aside className="max-h-[40vh] overflow-y-auto border-b border-[var(--border)] p-3 lg:max-h-none lg:border-b-0 lg:border-r">
          <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wider text-[var(--fg-dim)]">
            🧸 Toy presets
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
          {recent.length > 0 && !presetFilter && (
            <div className="mb-2">
              <p className="mb-1 px-1 text-[9px] font-bold uppercase text-[var(--fg-dim)]">
                Recent
              </p>
              <div className="flex flex-wrap gap-1">
                {recent.map((slug) => {
                  const p = PRESETS.find((x) => x.slug === slug);
                  if (!p) return null;
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => selectEffect(slug)}
                      className="rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[10px] hover:border-[var(--brand)]"
                    >
                      {p.emoji} {p.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {filteredPresets.map((p) => (
              <div
                key={p.slug}
                className={`flex min-w-[140px] items-stretch gap-1 rounded-xl border lg:min-w-0 ${
                  effect === p.slug
                    ? "border-[var(--brand)] bg-[var(--card)]"
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
            {filteredPresets.length === 0 && (
              <p className="px-1 text-xs text-[var(--fg-dim)]">No presets match</p>
            )}
          </div>
        </aside>

        {/* Controls */}
        <section className="space-y-4 overflow-y-auto border-b border-[var(--border)] p-4 lg:border-b-0 lg:border-r">
          {upgradedBanner && (
            <div className="rounded-xl border border-[var(--mint)]/40 bg-[color-mix(in_srgb,var(--mint)_10%,transparent)] px-3 py-2 text-xs">
              Paid allowance active — 720p path, no on-player watermark.
            </div>
          )}

          {mode === "i2v" ? (
            <div>
              <label className="text-xs font-semibold text-[var(--fg-muted)]">
                Your toy photo
              </label>
              <label
                className="mt-2 flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] transition-colors hover:border-[var(--brand)]/50"
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
                    🧸 Drop a photo of a figure you own
                    <br />
                    <span className="text-xs">
                      or click · PNG/JPG · clean background works best
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
              {image && (
                <button
                  type="button"
                  className="mt-1 text-[10px] text-[var(--fg-dim)] hover:text-[var(--brand)]"
                  onClick={() => setImage(null)}
                >
                  Remove photo
                </button>
              )}
              {!image && (
                <div className="mt-2">
                  <p className="mb-1 text-[10px] font-semibold text-[var(--fg-dim)]">
                    Or try a sample still
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_TOYS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] hover:border-[var(--brand)]"
                        onClick={async () => {
                          try {
                            setError(null);
                            const data = await sampleToDataUrl(s.path);
                            setImage(data);
                            selectEffect(s.effect);
                          } catch {
                            setError("Could not load sample photo");
                          }
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <p className="mt-2 text-[10px] text-[var(--fg-dim)]">
                Tip: only animate toys you own. Works great for blind boxes,
                resin, plush, gunpla.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm text-[var(--fg-muted)]">
              Text → Video is on the roadmap. For the best figure consistency,
              use <strong className="text-[var(--fg)]">Image → Video</strong>{" "}
              with a real shelf photo + Seedance.
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-[var(--fg-muted)]">
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
            <p className="text-xs font-semibold text-[var(--fg-muted)]">
              Aspect ratio
            </p>
            <div className="mt-1.5 flex gap-2">
              {(
                [
                  { id: "9:16" as const, label: "9:16 · TikTok" },
                  { id: "1:1" as const, label: "1:1 · Shop" },
                  { id: "16:9" as const, label: "16:9 · Wide" },
                ] as const
              ).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAspectRatio(a.id)}
                  className={`flex-1 rounded-lg border px-1 py-2 text-[11px] font-semibold ${
                    aspectRatio === a.id
                      ? "border-[var(--brand)] bg-[var(--grad-soft)]"
                      : "border-[var(--border)] text-[var(--fg-muted)]"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-[var(--fg-muted)]">
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
                    {locked ? " 🔒" : ""}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-semibold text-[var(--fg-muted)]">
                Seed (optional)
              </label>
              <button
                type="button"
                className="text-[10px] text-[var(--fg-dim)] hover:text-[var(--fg)]"
                onClick={() =>
                  setSeed(String(Math.floor(Math.random() * 1_000_000_000)))
                }
              >
                Random
              </button>
            </div>
            <input
              value={seed}
              onChange={(e) => setSeed(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="Empty = random"
              className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--fg-muted)]">
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
              rows={5}
              className="mt-2 w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)]"
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
            <p className="mt-1 text-[10px] text-[var(--fg-dim)]">
              {preset.name} · for {preset.audience}s · keep the toy as hero
            </p>
          </div>

          <button
            type="button"
            onClick={generate}
            disabled={
              busy ||
              !canAfford ||
              mode === "t2v" ||
              (mode === "i2v" && !image)
            }
            className="btn btn-primary w-full disabled:opacity-50"
          >
            {busy
              ? "Generating…"
              : mode === "t2v"
                ? "Text→Video soon — use Image→Video"
                : !canAfford
                  ? "Out of credits"
                  : `Generate · ${CREDITS_PER_VIDEO} credits · ${effectiveDuration}s · ${aspectRatio}`}
          </button>

          {error && (
            <p className="text-sm text-[var(--brand)]">{error}</p>
          )}

          {showPaywall && (
            <PaywallCard title="Allowance used up — compare finite plans" />
          )}
        </section>

        {/* Result — large preview like HF generate */}
        <section className="flex flex-col bg-[var(--bg-soft)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Output</h2>
            <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--fg-dim)]">
              {usedModel || MODELS.find((m) => m.id === modelId)?.label}
            </span>
          </div>
          <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-black/40">
            {status === "generating" && (
              <div className="p-10 text-center text-[var(--fg-muted)]">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--mint)]" />
                <p className="font-medium text-[var(--fg)]">
                  Animating your figure…
                </p>
                <p className="mt-1 text-xs text-[var(--fg-dim)]">
                  {elapsed < 3
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
            {status === "done" && videoUrl && (
              <div className="relative w-full p-3">
                <div className="mb-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCompare((c) => !c)}
                    className="text-[10px] font-semibold text-[var(--brand)] hover:underline"
                  >
                    {compare ? "Video only" : "Photo ↔ video"}
                  </button>
                </div>
                {compare && image ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 text-center text-[10px] font-bold uppercase text-[var(--fg-dim)]">
                        Before
                      </p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt="before"
                        className="mx-auto max-h-[50vh] rounded-lg object-contain"
                      />
                    </div>
                    <div className="relative">
                      <p className="mb-1 text-center text-[10px] font-bold uppercase text-[var(--fg-dim)]">
                        After
                      </p>
                      <video
                        src={videoUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="mx-auto max-h-[50vh] rounded-lg"
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
                      src={videoUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="mx-auto max-h-[70vh] rounded-lg"
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
                <p className="mx-auto mt-2 max-w-md text-center text-[11px] leading-relaxed text-[var(--fg-dim)]">
                  {demo
                    ? "Cached demo — it does not animate your upload or call a live model. Configure FAL_KEY for a live Seedance render."
                    : "AI motion varies — same photo can look different each run. Not happy? Regenerate; failed jobs refund credits."}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <a
                    href={videoUrl}
                    download={`pikbo-${effect}.mp4`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary px-4 py-2 text-xs"
                  >
                    Download
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
                    onClick={generate}
                    className="btn btn-ghost px-4 py-2 text-xs"
                  >
                    Regenerate
                  </button>
                  <Link
                    href="/library"
                    className="btn btn-ghost px-4 py-2 text-xs"
                  >
                    Library
                  </Link>
                  <Link
                    href="/supercomputer"
                    className="btn btn-ghost px-4 py-2 text-xs"
                  >
                    Batch more
                  </Link>
                </div>
                <p className="mt-2 text-center text-[10px] text-[var(--fg-dim)]">
                  {effectiveDuration}s · {aspectRatio} · ⌘/Ctrl+Enter
                </p>
                {demo && (
                  <p className="mt-2 text-center text-xs text-[var(--fg-dim)]">
                    Cached demo only — configure FAL_KEY for a live Seedance render.
                  </p>
                )}
              </div>
            )}
            {(status === "idle" || status === "error") && !videoUrl && (
              <div className="p-10 text-center text-sm text-[var(--fg-dim)]">
                <p className="text-3xl">🧸</p>
                <p className="mt-3">Your clip will land here</p>
                <p className="mt-1 text-xs">
                  Perfect for TikTok, Etsy, Whatnot, shelf flexes
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
