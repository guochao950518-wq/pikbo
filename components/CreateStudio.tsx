"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PRESETS } from "@/lib/presets";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import type { PublicSession } from "@/lib/session";
import { site } from "@/lib/site";

type Status = "idle" | "uploading" | "generating" | "done" | "error";

export function CreateStudio({ initialEffect }: { initialEffect?: string }) {
  const [effect, setEffect] = useState(
    PRESETS.find((p) => p.slug === initialEffect)?.slug ?? PRESETS[0].slug
  );
  const [image, setImage] = useState<string | null>(null);
  const [extra, setExtra] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [watermark, setWatermark] = useState(true);
  const [session, setSession] = useState<PublicSession | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [upgradedBanner, setUpgradedBanner] = useState(false);

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
          } else if (!cancelled && params.get("upgraded") === "1") {
            setUpgradedBanner(true);
            await refreshSession();
          }
        } catch {
          if (!cancelled) await refreshSession();
        }
        // Clean query without reload
        const url = new URL(window.location.href);
        url.searchParams.delete("session_id");
        window.history.replaceState({}, "", url.pathname + url.search);
        return;
      }
      if (params.get("upgraded") === "1") {
        if (!cancelled) setUpgradedBanner(true);
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
    if (!image) {
      setError("Upload a photo of your toy first.");
      return;
    }
    if (session && session.credits < CREDITS_PER_VIDEO) {
      setShowPaywall(true);
      setError("Not enough credits for another clip.");
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
        body: JSON.stringify({ effect, image, extra }),
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
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
      refreshSession();
    }
  }

  const busy = status === "generating" || status === "uploading";
  const creditsLeft = session?.credits ?? null;
  const canAfford =
    creditsLeft === null || creditsLeft >= CREDITS_PER_VIDEO;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      {/* ---- Controls ---- */}
      <div className="card p-6">
        {upgradedBanner && (
          <div className="mb-4 rounded-xl border border-[var(--mint)]/40 bg-[color-mix(in_srgb,var(--mint)_12%,transparent)] px-4 py-3 text-sm">
            You&apos;re on a paid plan — no watermark, more credits. Happy
            creating.
          </div>
        )}

        {/* balance strip */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2.5 text-sm">
          <div className="text-[var(--fg-muted)]">
            {session ? (
              <>
                <span className="font-semibold text-[var(--fg)]">
                  {session.credits}
                </span>{" "}
                credits · {session.planName}
                {session.watermark && (
                  <span className="ml-2 text-xs text-[var(--fg-dim)]">
                    watermark on
                  </span>
                )}
              </>
            ) : (
              <span className="text-[var(--fg-dim)]">Loading credits…</span>
            )}
          </div>
          <Link
            href="/pricing"
            className="text-xs font-semibold text-[var(--mint)] hover:underline"
          >
            Get more →
          </Link>
        </div>

        {/* 1. upload */}
        <label className="text-sm font-semibold">1. Your toy photo</label>
        <label className="mt-2 flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] text-center">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt="uploaded toy"
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="px-6 text-sm text-[var(--fg-dim)]">
              Tap to upload a photo of a figure you own
              <br />
              <span className="text-xs">
                PNG or JPG, clean background works best
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

        {/* 2. effect */}
        <label className="mt-6 block text-sm font-semibold">2. Effect</label>
        <div className="mt-2 grid max-h-64 grid-cols-2 gap-2 overflow-y-auto pr-1">
          {PRESETS.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setEffect(p.slug)}
              className={`flex items-center gap-2 rounded-lg border p-2.5 text-left text-sm transition-colors ${
                effect === p.slug
                  ? "border-[var(--brand)] bg-[var(--card2)]"
                  : "border-[var(--border)] hover:bg-[var(--card2)]"
              }`}
            >
              <span className="text-lg">{p.emoji}</span>
              <span className="leading-tight">{p.name}</span>
            </button>
          ))}
        </div>

        {/* 3. optional prompt */}
        <label className="mt-6 block text-sm font-semibold">
          3. Add a twist{" "}
          <span className="text-[var(--fg-dim)]">(optional)</span>
        </label>
        <input
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder="e.g. neon city background, confetti, snow…"
          className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)]"
        />

        <button
          type="button"
          onClick={generate}
          disabled={busy || !canAfford}
          className="btn btn-primary mt-6 w-full disabled:opacity-60"
        >
          {busy
            ? "Generating…"
            : !canAfford
              ? "Out of credits — upgrade"
              : `Generate clip · ${CREDITS_PER_VIDEO} credits`}
        </button>
        {error && (
          <p className="mt-3 text-sm text-[var(--brand)]">{error}</p>
        )}

        {showPaywall && (
          <div className="mt-4 rounded-xl border border-[var(--brand)]/40 bg-[color-mix(in_srgb,var(--brand)_10%,transparent)] p-4">
            <p className="text-sm font-semibold">You&apos;re out of free credits</p>
            <p className="mt-1 text-xs text-[var(--fg-muted)]">
              Upgrade to Creator for ~50 clips/mo, no watermark, commercial use.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/pricing" className="btn btn-primary text-sm">
                See plans
              </Link>
              <button
                type="button"
                className="btn btn-ghost text-sm"
                onClick={() => setShowPaywall(false)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---- Result ---- */}
      <div className="card flex flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-semibold">Result</h2>
          <span className="chip">{preset.name}</span>
        </div>
        <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-[var(--bg-soft)]">
          {status === "generating" && (
            <div className="p-10 text-center text-[var(--fg-muted)]">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--brand)]" />
              Rendering your clip…
              <p className="mt-1 text-xs text-[var(--fg-dim)]">
                Usually 15–40 seconds
              </p>
            </div>
          )}
          {status === "done" && videoUrl && (
            <div className="w-full p-4">
              <div className="relative mx-auto w-fit max-w-full">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="mx-auto max-h-[60vh] rounded-lg"
                />
                {watermark && (
                  <div
                    className="pointer-events-none absolute bottom-3 right-3 rounded-md px-2 py-1 text-xs font-bold tracking-wide text-white/90 shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,77,141,.85), rgba(168,85,247,.85))",
                    }}
                  >
                    {site.name}
                  </div>
                )}
              </div>
              {watermark && (
                <p className="mt-3 text-center text-xs text-[var(--fg-dim)]">
                  Free plan includes a watermark.{" "}
                  <Link
                    href="/pricing"
                    className="text-[var(--mint)] hover:underline"
                  >
                    Remove it with Creator
                  </Link>
                </p>
              )}
              {demo && (
                <p className="mt-2 text-center text-xs text-[var(--fg-dim)]">
                  Demo mode — add a FAL_KEY in{" "}
                  <code className="text-[var(--fg-muted)]">.env.local</code> to
                  render real clips from your photo.
                </p>
              )}
              {!watermark && !demo && (
                <p className="mt-3 text-center text-xs text-[var(--mint)]">
                  HD export · no watermark · commercial use
                </p>
              )}
            </div>
          )}
          {(status === "idle" || status === "error") && !videoUrl && (
            <p className="p-10 text-center text-sm text-[var(--fg-dim)]">
              Your generated clip will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
