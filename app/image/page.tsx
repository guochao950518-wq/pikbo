"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import {
  clearImageHistory,
  loadImageHistory,
  pushImageHistory,
  type ImageHistoryItem,
} from "@/lib/imageHistory";

export default function ImageStudioPage() {
  const [prompt, setPrompt] = useState(
    "Studio product photo of a designer vinyl art toy, soft box lighting, matte finish, sharp paint apps, catalog ready"
  );
  const [aspect, setAspect] = useState("3:4");
  const [busy, setBusy] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [history, setHistory] = useState<ImageHistoryItem[]>([]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setHistory(loadImageHistory());
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  async function generate() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspect }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setImageUrl(data.imageUrl);
      setDemo(Boolean(data.demo));
      if (data.imageUrl && !String(data.imageUrl).startsWith("data:image/svg")) {
        setHistory(
          pushImageHistory({
            imageUrl: data.imageUrl,
            prompt,
            demo: data.demo,
          })
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <span className="chip">🖼️ Still studio</span>
        <h1 className="mt-3 text-3xl font-bold">Still studio</h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Mock packaging & colorways before motion. Live Flux stills use fal and
          cost {CREDITS_PER_VIDEO} credits; validation previews cost 0. Then
          animate in Generate.
        </p>

        <div className="card mt-8 grid gap-6 p-6 lg:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-[var(--fg-dim)]">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
            />
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {["1:1", "3:4", "16:9", "9:16"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAspect(r)}
                  className={`rounded-lg border px-2 py-1 ${
                    aspect === r
                      ? "border-[var(--brand)] text-[var(--fg)]"
                      : "border-[var(--border)] text-[var(--fg-muted)]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={generate}
              className="btn btn-primary mt-4 w-full disabled:opacity-50"
            >
              {busy
                ? "Generating still…"
                : `Generate still · up to ${CREDITS_PER_VIDEO} credits`}
            </button>
            {error && (
              <p className="mt-2 text-sm text-[var(--brand)]">{error}</p>
            )}
            {demo && (
              <p className="mt-2 text-xs text-[var(--fg-dim)]">
                Validation preview — no provider call or credit charge. Add
                FAL_KEY for live Flux stills.
              </p>
            )}
            {imageUrl && imageUrl.startsWith("http") && (
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="/create"
                  className="btn btn-primary w-full text-sm"
                  onClick={() => {
                    try {
                      sessionStorage.setItem("pikbo_pending_still", imageUrl);
                    } catch {
                      // ignore
                    }
                  }}
                >
                  Animate in Generate →
                </Link>
                <Link
                  href="/effects/360-spin-showcase"
                  className="btn btn-ghost w-full text-sm"
                  onClick={() => {
                    try {
                      sessionStorage.setItem("pikbo_pending_still", imageUrl);
                    } catch {
                      // ignore
                    }
                  }}
                >
                  Or spin on effect page →
                </Link>
              </div>
            )}
          </div>
          <div className="grid place-items-center overflow-hidden rounded-xl border border-dashed border-[var(--border)] bg-black/30">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="generated still"
                className="max-h-[28rem] w-full object-contain"
              />
            ) : (
              <div className="p-8 text-center text-sm text-[var(--fg-dim)]">
                <p className="text-3xl">🧸</p>
                <p className="mt-2">Preview</p>
              </div>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="mt-10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Recent stills</h2>
              <button
                type="button"
                className="text-xs text-[var(--fg-dim)] hover:text-[var(--brand)]"
                onClick={() => {
                  clearImageHistory();
                  setHistory([]);
                }}
              >
                Clear
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {history.map((h) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={h.id}
                  src={h.imageUrl}
                  alt=""
                  className="aspect-[3/4] cursor-pointer rounded-lg object-cover ring-1 ring-[var(--border)] hover:ring-[var(--brand)]"
                  onClick={() => setImageUrl(h.imageUrl)}
                />
              ))}
            </div>
          </div>
        )}

        <p className="mt-6 text-sm text-[var(--fg-muted)]">
          Have a real figure photo?{" "}
          <Link
            href="/create"
            className="font-semibold text-[var(--brand)] hover:underline"
          >
            Animate it with Seedance
          </Link>
        </p>
      </div>
    </div>
  );
}
