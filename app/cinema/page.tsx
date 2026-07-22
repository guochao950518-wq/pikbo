"use client";

import Link from "next/link";
import { useState } from "react";
import { PRESETS } from "@/lib/presets";

const LENSES = ["24mm", "35mm", "50mm", "85mm", "100mm macro"];
const MOVES = ["Static", "Slow push-in", "Orbit", "Handheld", "Crane up"];
const LOOKS = ["Clean product", "Neon night", "Soft daylight", "Cine teal-orange"];

/**
 * Cinema Studio — feature parity surface with big AI film tools.
 * Feeds into Generate with composed prompt (live Seedance).
 */
export default function CinemaPage() {
  const [lens, setLens] = useState(LENSES[1]);
  const [move, setMove] = useState(MOVES[1]);
  const [look, setLook] = useState(LOOKS[0]);
  const [shot, setShot] = useState(
    "Designer vinyl figure on seamless, sharp sculpt and paint, premium catalog lighting, toy photography"
  );
  const [effect, setEffect] = useState(PRESETS[0]?.slug ?? "360-spin-showcase");

  const composed = [
    shot,
    `Lens ${lens}.`,
    `Camera: ${move}.`,
    `Grade: ${look}.`,
    "Cinematic, high detail, stable subject.",
  ].join(" ");

  const href = `/create?effect=${encodeURIComponent(effect)}&prompt=${encodeURIComponent(composed)}`;

  return (
    <div className="px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--lime)]">
              Cinema Studio
            </p>
            <h1 className="mt-1 text-3xl font-bold">Director board</h1>
            <p className="mt-2 max-w-xl text-sm text-[var(--fg-muted)]">
              Pick lens & camera moves for your figure, then render with
              Seedance — pro film-studio flow, toy-native subject.
            </p>
          </div>
          <Link
            href={href}
            className="btn btn-primary px-5 py-2.5 text-sm"
          >
            Render my figure →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-[var(--fg-dim)]">
                Shot brief
              </span>
              <textarea
                value={shot}
                onChange={(e) => setShot(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm outline-none focus:border-[var(--lime)]"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Lens" value={lens} options={LENSES} onChange={setLens} />
              <Field label="Camera move" value={move} options={MOVES} onChange={setMove} />
              <Field label="Look" value={look} options={LOOKS} onChange={setLook} />
            </div>

            <div>
              <span className="text-xs font-semibold text-[var(--fg-dim)]">
                Base preset
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {PRESETS.slice(0, 8).map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => setEffect(p.slug)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs ${
                      effect === p.slug
                        ? "border-[var(--lime)] text-[var(--lime)]"
                        : "border-[var(--border)] text-[var(--fg-muted)]"
                    }`}
                  >
                    {p.emoji} {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-black/40 p-4">
              <p className="text-[10px] font-bold uppercase text-[var(--fg-dim)]">
                Composed prompt
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
                {composed}
              </p>
            </div>
          </div>

          <aside className="card h-fit space-y-3 p-5">
            <h2 className="font-semibold">Shot list (storyboard)</h2>
            {["Wide establish", "Hero medium", "Detail insert"].map((s, i) => (
              <div
                key={s}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm"
              >
                <span className="text-[var(--fg-dim)]">{i + 1}.</span> {s}
              </div>
            ))}
            <p className="text-[11px] text-[var(--fg-dim)]">
              Multi-shot batch render ships after auth queue. Single-shot
              renders now via Generate + Seedance.
            </p>
            <Link href={href} className="btn btn-primary w-full text-sm">
              Open Generate
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-[var(--fg-dim)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
