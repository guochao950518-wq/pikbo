"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { pushHistory } from "@/lib/history";
import type { PublicSession } from "@/lib/session";
import { site } from "@/lib/site";

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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
      setStatus("error");
      void refreshSession();
    }
  }

  const busy = status === "generating";

  return (
    <div className="card overflow-hidden p-0">
      <div className="border-b border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--fg-dim)]">
          Try free · {effectName}
        </p>
        <p className="mt-0.5 text-sm text-[var(--fg-muted)]">
          Upload one photo → get a clip on this page (no extra hop).
          {session && (
            <span className="ml-2 text-[var(--mint)]">
              {session.credits} credits
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        {/* Upload / controls */}
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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt="Your toy"
                className="max-h-56 rounded-lg object-contain"
              />
            ) : (
              <div className="text-center text-sm text-[var(--fg-dim)]">
                <p className="text-3xl">🧸</p>
                <p className="mt-2 font-medium text-[var(--fg-muted)]">
                  Drop a toy photo
                </p>
                <p className="mt-1 text-xs">PNG / JPG · toys you own</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => loadFile(e.target.files?.[0])}
            />
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
            Want full controls?{" "}
            <Link
              href={`/create?effect=${effectSlug}`}
              className="text-[var(--mint)] hover:underline"
            >
              Open full studio →
            </Link>
          </p>
        </div>

        {/* Result */}
        <div className="relative min-h-[220px] border-t border-[var(--border)] bg-black/40 lg:border-t-0 lg:border-l">
          {videoUrl ? (
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
                  className="btn btn-ghost px-3 py-1.5 text-xs"
                >
                  Download
                </a>
                <Link
                  href="/library"
                  className="btn btn-ghost px-3 py-1.5 text-xs"
                >
                  Library
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid h-full min-h-[220px] place-items-center p-8 text-center text-sm text-[var(--fg-dim)]">
              <div>
                <p className="text-2xl">▶</p>
                <p className="mt-2">Your clip lands here</p>
                <p className="mt-1 text-xs">
                  Same page · SEO landing + real tool (V2)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
