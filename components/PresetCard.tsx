import Link from "next/link";
import type { Preset } from "@/lib/presets";

export function PresetCard({ preset }: { preset: Preset }) {
  return (
    <Link
      href={`/effects/${preset.slug}`}
      className="card group relative overflow-hidden p-5 transition-transform hover:-translate-y-1"
    >
      <div
        className="mb-4 grid h-32 place-items-center rounded-xl text-5xl"
        style={{ background: preset.gradient }}
      >
        <span className="drop-shadow-lg">{preset.emoji}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{preset.name}</h3>
        <span className="chip">
          {preset.audience === "seller" ? "Sellers" : "Collectors"}
        </span>
      </div>
      <p className="mt-1.5 text-sm text-[var(--fg-muted)]">{preset.tagline}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--mint)] opacity-0 transition-opacity group-hover:opacity-100">
        Open tool page →
      </span>
    </Link>
  );
}
