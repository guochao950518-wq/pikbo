"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { pushHistory } from "@/lib/history";
import { PRESETS } from "@/lib/presets";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import type { PublicSession } from "@/lib/session";
import { site } from "@/lib/site";

type Status = "idle" | "uploading" | "generating" | "done" | "error";
type Mode = "i2v" | "t2v";

const MODELS = [
  {
    id: "seedance-2",
    label: "Seedance 2.0",
    vendor: "ByteDance",
    blurb: "Best for figures · paid",
    free: false,
  },
  {
    id: "seedance-fast",
    label: "Seedance Fast",
    vendor: "ByteDance",
    blurb: "Quick shelf clips · free",
    free: true,
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
  const [mode, setMode] = useState<Mode>(initialMode ?? "i2v");
  const [modelId, setModelId] = useState<(typeof MODELS)[number]["id"]>(
    initialModel === "seedance-fast" ? "seedance-fast" : "seedance-2"
  );
  const [effect, setEffect] = useState(
    PRESETS.find((p) => p.slug === initialEffect)?.slug ?? PRESETS[0].slug
  );
  const [image, setImage] = useState<string | null>(null);
  const [extra, setExtra] = useState(initialPrompt ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [watermark, setWatermark] = useState(true);
  const [session, setSession] = useState<PublicSession | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [upgradedBanner, setUpgradedBanner] = useState(false);
  const [usedModel, setUsedModel] = useState<string | null>(null);

  const preset = useMemo(
    () => PRESETS.find((p) => p.slug === effect)!,
    [effect]
  );

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/me");
      const data = (await res.json()) as PublicSession;
      setSession(data);
      setWatermark(data.watermark);
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

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function generate() {
    if (mode === "i2v" && !image) {
      setError("Upload a reference image first (image-to-video).");
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
    setStatus("generating");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          effect,
          image:
            image ||
            // t2v stub still needs image for current API — use 1px placeholder later
            image,
          extra,
        }),
      });
      const data = await res.json();
      if (data.session) setSession(data.session);

      if (res.status === 402 || data.code === "INSUFFICIENT_CREDITS") {
        setShowPaywall(true);
        setError("Not enough credits. Upgrade to keep creating.");
        setStatus("error");
        return;
      }
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setVideoUrl(data.videoUrl);
      setDemo(Boolean(data.demo));
      setWatermark(Boolean(data.watermark));
      setUsedModel(data.model || null);
      setStatus("done");
      pushHistory({
        videoUrl: data.videoUrl,
        effect,
        effectName: preset.name,
        model: data.model,
        watermark: Boolean(data.watermark),
        demo: Boolean(data.demo),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
      refreshSession();
    }
  }

  const busy = status === "generating" || status === "uploading";
  const creditsLeft = session?.credits ?? null;
  const canAfford = creditsLeft === null || creditsLeft >= CREDITS_PER_VIDEO;

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
            onClick={() => setMode("t2v")}
            className={`rounded-full px-3 py-1.5 font-semibold ${
              mode === "t2v"
                ? "bg-[var(--card)] text-[var(--fg)]"
                : "text-[var(--fg-dim)]"
            }`}
          >
            Text → Video
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {MODELS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setModelId(m.id)}
              className={`rounded-xl border px-3 py-1.5 text-left text-xs transition-colors ${
                modelId === m.id
                  ? "border-[var(--mint)] bg-[color-mix(in_srgb,var(--mint)_12%,transparent)]"
                  : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-dim)]"
              }`}
            >
              <div className="font-semibold">{m.label}</div>
              <div className="text-[10px] text-[var(--fg-dim)]">
                {m.vendor} · {m.blurb}
              </div>
            </button>
          ))}
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
          <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {PRESETS.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => setEffect(p.slug)}
                className={`flex min-w-[140px] items-center gap-2 rounded-xl border p-2.5 text-left text-sm lg:min-w-0 ${
                  effect === p.slug
                    ? "border-[var(--brand)] bg-[var(--card)]"
                    : "border-transparent bg-[var(--bg-soft)] hover:border-[var(--border)]"
                }`}
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-lg"
                  style={{ background: p.gradient }}
                >
                  {p.emoji}
                </span>
                <span className="leading-tight">
                  <span className="block font-medium">{p.name}</span>
                  <span className="block text-[10px] text-[var(--fg-dim)]">
                    {p.duration}s · {p.aspectRatio}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Controls */}
        <section className="space-y-4 overflow-y-auto border-b border-[var(--border)] p-4 lg:border-b-0 lg:border-r">
          {upgradedBanner && (
            <div className="rounded-xl border border-[var(--mint)]/40 bg-[color-mix(in_srgb,var(--mint)_10%,transparent)] px-3 py-2 text-xs">
              Paid plan active — HD path, no watermark.
            </div>
          )}

          {mode === "i2v" ? (
            <div>
              <label className="text-xs font-semibold text-[var(--fg-muted)]">
                Your toy photo
              </label>
              <label className="mt-2 flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)]">
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
                      Clean background · even light · full toy in frame
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

          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] py-2">
              <div className="text-[var(--fg-dim)]">Duration</div>
              <div className="font-semibold text-[var(--fg)]">
                {preset.duration}s
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] py-2">
              <div className="text-[var(--fg-dim)]">Aspect</div>
              <div className="font-semibold text-[var(--fg)]">
                {preset.aspectRatio}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] py-2">
              <div className="text-[var(--fg-dim)]">Audience</div>
              <div className="font-semibold capitalize text-[var(--fg)]">
                {preset.audience}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--fg-muted)]">
              Motion prompt
            </label>
            <textarea
              value={extra || preset.promptTemplate}
              onChange={(e) => setExtra(e.target.value)}
              rows={5}
              className="mt-2 w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)]"
            />
            <p className="mt-1 text-[10px] text-[var(--fg-dim)]">
              Preset: {preset.name} · keep the toy as the hero of the shot
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
                  : `Generate · ${CREDITS_PER_VIDEO} credits`}
          </button>

          {error && (
            <p className="text-sm text-[var(--brand)]">{error}</p>
          )}

          {showPaywall && (
            <div className="rounded-xl border border-[var(--brand)]/40 p-3 text-sm">
              <p className="font-semibold">Out of free credits</p>
              <Link href="/pricing" className="btn btn-primary mt-2 text-sm">
                See plans
              </Link>
            </div>
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
                Animating your figure with Seedance…
                <p className="mt-1 text-xs text-[var(--fg-dim)]">
                  Usually 20–60s · hold paint detail
                </p>
              </div>
            )}
            {status === "done" && videoUrl && (
              <div className="relative w-full p-3">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
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
                {demo && (
                  <p className="mt-3 text-center text-xs text-[var(--fg-dim)]">
                    Demo clip — set FAL_KEY to run real Seedance.
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
