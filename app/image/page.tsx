"use client";

import Link from "next/link";
import { useState } from "react";

export default function ImageStudioPage() {
  const [prompt, setPrompt] = useState(
    "Studio product photo of a designer vinyl art toy, soft box lighting, matte finish, sharp paint apps, catalog ready"
  );

  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <span className="chip">🖼️ Stills</span>
        <h1 className="mt-3 text-3xl font-bold">Still studio</h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Mock packaging, colorways, and hero stills before you animate.
          Image models wire up next — motion is live on Seedance.
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
              {["1:1 box art", "3:4 figure", "16:9 shelf", "9:16 story"].map(
                (r) => (
                  <span
                    key={r}
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-[var(--fg-muted)]"
                  >
                    {r}
                  </span>
                )
              )}
            </div>
            <button
              type="button"
              disabled
              className="btn btn-primary mt-4 w-full opacity-60"
            >
              Generate still (image model next)
            </button>
          </div>
          <div className="grid place-items-center rounded-xl border border-dashed border-[var(--border)] bg-black/30 text-sm text-[var(--fg-dim)]">
            <div className="text-center">
              <p className="text-3xl">🧸</p>
              <p className="mt-2">Preview</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-[var(--fg-muted)]">
          Ready to move?{" "}
          <Link href="/create" className="font-semibold text-[var(--brand)] hover:underline">
            Photo → clip with Seedance
          </Link>
        </p>
      </div>
    </div>
  );
}
