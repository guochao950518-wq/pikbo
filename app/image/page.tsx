"use client";

import Link from "next/link";
import { useState } from "react";

/** Image Studio — parity page with suite apps; video remains primary live path. */
export default function ImageStudioPage() {
  const [prompt, setPrompt] = useState(
    "Studio product photo of a designer vinyl figure, soft box lighting, sharp detail"
  );

  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--lime)]">
          Image Studio
        </p>
        <h1 className="mt-1 text-3xl font-bold">Still generation</h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Full suites expose image models (Seedream / Flux / etc.) next to
          video. Wire fal image endpoints next; UI is ready.
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
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm"
            />
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {["1:1", "3:4", "16:9", "9:16"].map((r) => (
                <span
                  key={r}
                  className="rounded-lg border border-[var(--border)] px-2 py-1 text-[var(--fg-muted)]"
                >
                  {r}
                </span>
              ))}
            </div>
            <button
              type="button"
              disabled
              className="btn btn-primary mt-4 w-full opacity-60"
            >
              Generate image (connect fal image model)
            </button>
          </div>
          <div className="grid place-items-center rounded-xl border border-dashed border-[var(--border)] bg-black/30 text-sm text-[var(--fg-dim)]">
            Preview
          </div>
        </div>

        <p className="mt-6 text-sm">
          Need motion?{" "}
          <Link href="/create" className="text-[var(--lime)] hover:underline">
            Open Image → Video with Seedance
          </Link>
        </p>
      </div>
    </div>
  );
}
