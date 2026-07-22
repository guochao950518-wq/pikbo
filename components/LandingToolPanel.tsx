"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { pushHistory } from "@/lib/history";
import { SAMPLE_TOYS, sampleToDataUrl } from "@/lib/samples";
import type { PublicSession } from "@/lib/session";
import { site } from "@/lib/site";
import { useToast } from "@/components/Toast";

type Status = "idle" | "generating" | "done" | "error";

/**
 * 哥飞 V2 精品工具页 — 工具块（客户端）
 * 与落地文案同页：上传 → 生成 → 结果，不跳到 /create 也能完成需求。
 */
export function LandingToolPanel({
  effectSlug,
  effectName,
  duration = 5,
  aspectRatio = "9:16",
}: {
  effectSlug: string;
  effectName: string;
  duration?: number;
  aspectRatio?: string;
}) {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [watermark, setWatermark] = useState(true);
  const [session, setSession] = useState<PublicSession | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [loadingSample, setLoadingSample] = useState(false);
  const toast = useToast();

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
    const t = window.setTimeout(() => {
      void refreshSession();
      // Still studio → effect page handoff
      try {
        const pending = sessionStorage.getItem("pikbo_pending_still");
        if (pending?.startsWith("http") || pending?.startsWith("data:")) {
          sessionStorage.removeItem("pikbo_pending_still");
          if (pending.startsWith("data:")) {
            setImage(pending);
          } else {
            sampleToDataUrl(pending)
              .then((data) => setImage(data))
              .catch(() => undefined);
          }
        }
      } catch {
        // ignore
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, [refreshSession]);

  useEffect(() => {
    if (status !== "generating") return;
    const t0 = Date.now();
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - t0) / 1000));
    }, 250);
    return () => window.clearInterval(id);
  }, [status]);

  function loadFile(file: File | undefined | null) {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please drop a PNG or JPG of your toy.");
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
      setVideoUrl(null);
      setStatus("idle");
    };
    reader.readAsDataURL(file);
  }

  async function loadSampleStill(path: string) {
    setLoadingSample(true);
    setError(null);
    try {
      const data = await sampleToDataUrl(path);
      setImage(data);
      setVideoUrl(null);
      setStatus("idle");
    } catch {
      setError("Could not load sample photo");
    } finally {
      setLoadingSample(false);
    }
  }

  async function generate() {
    if (!image) {
      setError("Upload a toy photo first.");
      return;
    }
    if (session && session.credits < CREDITS_PER_VIDEO) {
      setError("Not enough credits — upgrade on Pricing.");
      return;
    }
    setError(null);
    setVideoUrl(null);
    setElapsed(0);
    setStatus("generating");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          effect: effectSlug,
          image,
          duration,
          aspectRatio,
          resolution:
            session?.plan === "free" || session?.watermark ? "480p" : "720p",
        }),
      });
      const data = await res.json();
      if (data.session) setSession(data.session);
      if (res.status === 402) {
        setError("Not enough credits. Upgrade to keep creating.");
        setStatus("error");
        return;
      }
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setVideoUrl(data.videoUrl);
      setDemo(Boolean(data.demo));
      setWatermark(Boolean(data.watermark));
      setStatus("done");
      pushHistory({
        videoUrl: data.videoUrl,
        effect: effectSlug,
        effectName,
        model: data.model,
        watermark: Boolean(data.watermark),
        demo: Boolean(data.demo),
      });
      toast(data.demo ? "Demo clip ready" : "Clip ready · saved to Library");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
      setStatus("error");
      void refreshSession();
    }
  }

  const busy = status === "generating";
  const progress = busy ? Math.min(95, 12 + elapsed * 4) : status === "done" ? 100 : 0;

  // Prefer samples tagged for this effect, else all
  const samples = [
    ...SAMPLE_TOYS.filter((s) => s.effect === effectSlug),
    ...SAMPLE_TOYS.filter((s) => s.effect !== effectSlug),
  ].slice(0, 4);

  return (
    <div className="card overflow-hidden p-0">
      <div className="border-b border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--fg-dim)]">
              Try free · {effectName}
            </p>
            <p className="mt-0.5 text-sm text-[var(--fg-muted)]">
              Upload one photo → clip on this page (no extra hop).
            </p>
          </div>
          {session && (
            <div className="text-right text-xs">
              <p className="font-semibold text-[var(--mint)]">
                {session.credits} credits
              </p>
              <p className="text-[var(--fg-dim)]">
                ~{Math.floor(session.credits / CREDITS_PER_VIDEO)} clips ·{" "}
                {session.planName}
              </p>
            </div>
          )}
        </div>
        {busy && (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/30">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: "var(--grad)",
              }}
            />
          </div>
        )}
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="space-y-4 p-5">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              loadFile(e.dataTransfer.files?.[0]);
            }}
            className="relative grid min-h-[200px] place-items-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg)] p-4"
          >
            {image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Your toy"
                  className="max-h-56 rounded-lg object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setVideoUrl(null);
                    setStatus("idle");
                  }}
                  className="absolute right-3 top-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-[10px] text-[var(--fg-muted)] hover:text-[var(--fg)]"
                >
                  Clear
                </button>
              </>
            ) : (
              <div className="text-center text-sm text-[var(--fg-dim)]">
                <p className="text-3xl">🧸</p>
                <p className="mt-2 font-medium text-[var(--fg-muted)]">
                  Drop a toy photo
                </p>
                <p className="mt-1 text-xs">PNG / JPG · toys you own</p>
              </div>
            )}
            {!image && (
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e) => loadFile(e.target.files?.[0])}
              />
            )}
          </div>

          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--fg-dim)]">
              Or try a sample still
            </p>
            <div className="flex flex-wrap gap-2">
              {samples.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  disabled={loadingSample || busy}
                  onClick={() => void loadSampleStill(s.path)}
                  className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] text-[var(--fg-muted)] hover:border-[var(--brand)] disabled:opacity-50"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] text-[var(--fg-dim)]">
            <span className="rounded-md border border-[var(--border)] px-2 py-1">
              {duration}s
            </span>
            <span className="rounded-md border border-[var(--border)] px-2 py-1">
              {aspectRatio}
            </span>
            <span className="rounded-md border border-[var(--border)] px-2 py-1">
              Seedance
            </span>
            <span className="rounded-md border border-[var(--border)] px-2 py-1">
              {CREDITS_PER_VIDEO} credits
            </span>
            {(session?.plan === "free" || session?.watermark) && (
              <span className="rounded-md border border-[var(--border)] px-2 py-1">
                480p · mark
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={busy || !image}
            onClick={() => void generate()}
            className="btn btn-primary w-full disabled:opacity-50"
          >
            {busy
              ? `Generating… ${elapsed}s`
              : `Generate ${effectName} · ${CREDITS_PER_VIDEO} credits`}
          </button>

          {error && (
            <p className="text-center text-xs text-[var(--brand)]">
              {error}{" "}
              {error.toLowerCase().includes("credit") && (
                <Link href="/pricing" className="underline">
                  Pricing
                </Link>
              )}
            </p>
          )}

          <p className="text-center text-[10px] text-[var(--fg-dim)]">
            Duration / seed / batch?{" "}
            <Link
              href={`/create?effect=${effectSlug}`}
              className="text-[var(--mint)] hover:underline"
            >
              Full studio →
            </Link>
          </p>
        </div>

        <div className="relative min-h-[220px] border-t border-[var(--border)] bg-black/40 lg:border-t-0 lg:border-l">
          {busy && (
            <div className="grid h-full min-h-[220px] place-items-center p-8 text-center">
              <div>
                <div
                  className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[var(--brand)]"
                />
                <p className="mt-4 text-sm text-[var(--fg-muted)]">
                  Seedance is rendering…
                </p>
                <p className="mt-1 text-xs text-[var(--fg-dim)]">
                  Usually 30–90s · {elapsed}s elapsed
                </p>
              </div>
            </div>
          )}
          {!busy && videoUrl ? (
            <div className="relative p-4">
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                muted
                playsInline
                className="mx-auto max-h-[320px] w-full rounded-lg"
              />
              {watermark && (
                <div
                  className="pointer-events-none absolute bottom-8 right-8 rounded-md px-2 py-1 text-[10px] font-bold text-white/90"
                  style={{ background: "var(--grad)" }}
                >
                  {site.name}
                </div>
              )}
              {demo && (
                <p className="mt-2 text-center text-[10px] text-[var(--fg-dim)]">
                  Demo clip — set FAL_KEY for real Seedance.
                </p>
              )}
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <a
                  href={videoUrl}
                  download={`pikbo-${effectSlug}.mp4`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary px-3 py-1.5 text-xs"
                >
                  Download
                </a>
                <button
                  type="button"
                  onClick={() => void generate()}
                  className="btn btn-ghost px-3 py-1.5 text-xs"
                >
                  Regenerate
                </button>
                <Link
                  href="/library"
                  className="btn btn-ghost px-3 py-1.5 text-xs"
                >
                  Library
                </Link>
              </div>
            </div>
          ) : null}
          {!busy && !videoUrl ? (
            <div className="grid h-full min-h-[220px] place-items-center p-8 text-center text-sm text-[var(--fg-dim)]">
              <div>
                <p className="text-2xl">▶</p>
                <p className="mt-2">Your clip lands here</p>
                <p className="mt-1 text-xs">
                  Tool + landing on one page — ready for search & convert
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
