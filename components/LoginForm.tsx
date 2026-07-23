"use client";

import { useState } from "react";

type AuthPublic = {
  configured: boolean;
  providers: { emailMagicLink: boolean; google: boolean };
  mode: string;
  message: string;
};

export function LoginForm({ auth }: { auth: AuthPublic }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (!auth.configured) {
    return (
      <div className="mt-6 space-y-3 rounded-2xl border border-dashed border-white/15 bg-black/40 p-5">
        <p className="text-sm font-semibold text-white">Sign-in not live yet</p>
        <p className="text-xs leading-relaxed text-white/55">
          Supabase Auth keys are not configured on this deployment. Your guest
          cookie still works for Generate, credits, and this-device Library.
        </p>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setNote(null);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        setErr(data.error || "Could not send magic link");
        return;
      }
      setNote(
        data.message ||
          "Check your email for a magic link. You can close this tab after clicking it."
      );
    } catch {
      setErr("Network error — try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      onSubmit={(e) => void onSubmit(e)}
    >
      <label className="block text-xs font-semibold text-white/70">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@studio.com"
          className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--mint)]"
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="btn btn-primary w-full py-2.5 text-sm disabled:opacity-50"
      >
        {busy ? "Sending…" : "Email magic link"}
      </button>
      {note && (
        <p className="text-xs leading-relaxed text-[var(--mint)]">{note}</p>
      )}
      {err && (
        <p className="text-xs leading-relaxed text-amber-200" role="alert">
          {err}
        </p>
      )}
      <p className="text-[10px] leading-relaxed text-white/40">
        Keys are on this server. First sign-in may need Email provider enabled in
        Supabase Authentication → Providers. Guest cookie still works without
        signing in.
      </p>
    </form>
  );
}
