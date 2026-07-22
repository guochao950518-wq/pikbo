"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearHistory, loadHistory } from "@/lib/history";
import type { PublicSession } from "@/lib/session";

export default function SettingsPage() {
  const [session, setSession] = useState<PublicSession | null>(null);
  const [libCount, setLibCount] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);

  function refreshLocal() {
    setLibCount(loadHistory().length);
  }

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
    const t = window.setTimeout(() => {
      refreshLocal();
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  function clearKey(key: string, label: string) {
    try {
      localStorage.removeItem(key);
      setMsg(`Cleared ${label}`);
      refreshLocal();
    } catch {
      setMsg("Could not clear");
    }
  }

  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-lg">
        <span className="chip">Settings</span>
        <h1 className="mt-3 text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Device data & session. Cloud accounts come later.
        </p>

        <div className="card mt-8 space-y-4 p-6 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--fg-muted)]">Plan</span>
            <span className="font-semibold">{session?.planName ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--fg-muted)]">Credits</span>
            <span className="font-semibold text-[var(--mint)]">
              {session?.credits ?? "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--fg-muted)]">Library clips</span>
            <span className="font-semibold">{libCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--fg-muted)]">Video engine</span>
            <span className="font-semibold">Seedance (ByteDance)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--fg-muted)]">FAL_KEY</span>
            <span className="text-xs text-[var(--fg-dim)]">
              server-side only
            </span>
          </div>
        </div>

        <div className="card mt-4 space-y-2 p-6">
          <h2 className="font-semibold">Clear device data</h2>
          <button
            type="button"
            className="btn btn-ghost w-full text-sm"
            onClick={() => {
              clearHistory();
              setMsg("Library cleared");
              refreshLocal();
            }}
          >
            Clear library
          </button>
          <button
            type="button"
            className="btn btn-ghost w-full text-sm"
            onClick={() => clearKey("pikbo_favorite_effects", "favorites")}
          >
            Clear favorites
          </button>
          <button
            type="button"
            className="btn btn-ghost w-full text-sm"
            onClick={() => clearKey("pikbo_recent_effects", "recent presets")}
          >
            Clear recent presets
          </button>
          <button
            type="button"
            className="btn btn-ghost w-full text-sm"
            onClick={() => clearKey("pikbo_onboard_v1", "onboarding flag")}
          >
            Reset onboarding banner
          </button>
          <button
            type="button"
            className="btn btn-ghost w-full text-sm"
            onClick={() => clearKey("pikbo_image_library_v1", "still library")}
          >
            Clear still library
          </button>
          {msg && (
            <p className="text-center text-xs text-[var(--mint)]">{msg}</p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href="/profile" className="text-[var(--brand)] hover:underline">
            Profile
          </Link>
          <Link href="/pricing" className="text-[var(--brand)] hover:underline">
            Pricing
          </Link>
          <Link href="/privacy" className="text-[var(--fg-dim)] hover:underline">
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}
