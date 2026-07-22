"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const PRESETS_QUICK = [
  { slug: "360-spin-showcase", label: "360° spin", emoji: "🌀" },
  { slug: "blind-box-unboxing", label: "Unbox", emoji: "📦" },
  { slug: "floating-hero", label: "Float", emoji: "✨" },
] as const;

/**
 * Home hero: drop a toy photo → stash still → jump to full studio or effect page.
 */
export function HeroUpload() {
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [effect, setEffect] = useState<string>(PRESETS_QUICK[0].slug);

  function goWithFile(file: File | undefined | null) {
    if (!file || !file.type.startsWith("image/")) {
      setErr("Use a PNG or JPG of a toy you own.");
      return;
    }
    if (file.size > 8_000_000) {
      setErr("Max ~8MB photo.");
      return;
    }
    setBusy(true);
    setErr(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        sessionStorage.setItem(
          "pikbo_pending_still",
          reader.result as string
        );
      } catch {
        setErr("Could not save photo in browser storage.");
        setBusy(false);
        return;
      }
      router.push(`/create?effect=${encodeURIComponent(effect)}`);
    };
    reader.onerror = () => {
      setErr("Could not read file.");
      setBusy(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="mt-8 max-w-lg">
      <div className="mb-2 flex flex-wrap gap-1.5">
        {PRESETS_QUICK.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setEffect(p.slug)}
            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
              effect === p.slug
                ? "border-[var(--brand)] bg-[var(--grad-soft)] text-[var(--fg)]"
                : "border-[var(--border)] text-[var(--fg-dim)] hover:text-[var(--fg)]"
            }`}
          >
            {p.emoji} {p.label}
          </button>
        ))}
      </div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHover(false);
          goWithFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-6 transition-colors ${
          hover
            ? "border-[var(--brand)] bg-[var(--grad-soft)]"
            : "border-white/15 bg-black/20 hover:border-[var(--brand)]/50"
        }`}
      >
        <p className="text-2xl">🧸</p>
        <p className="mt-2 text-sm font-semibold">
          {busy ? "Opening studio…" : "Drop a toy photo to start"}
        </p>
        <p className="mt-1 text-center text-[11px] text-[var(--fg-dim)]">
          Goes straight to Generate with your preset · no account needed
        </p>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={busy}
          onChange={(e) => goWithFile(e.target.files?.[0])}
        />
      </label>
      {err && (
        <p className="mt-2 text-center text-xs text-[var(--brand)]">{err}</p>
      )}
    </div>
  );
}
