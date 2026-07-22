"use client";

import Link from "next/link";
import { useState } from "react";

export function AuthPanel({ enabled }: { enabled: boolean }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/auth/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, email, password }),
      });
      const data = (await response.json()) as {
        error?: string;
        confirmationRequired?: boolean;
      };
      if (!response.ok) throw new Error(data.error || "Authentication failed");
      if (data.confirmationRequired) {
        setMessage("Check your email to confirm the account, then sign in.");
      } else {
        window.location.href = "/profile";
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card mx-auto mt-8 max-w-md p-6 sm:p-8">
      <div className="grid grid-cols-2 rounded-full border border-[var(--border)] bg-[var(--bg)] p-1 text-sm">
        {(["login", "signup"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`rounded-full px-4 py-2 font-semibold ${
              mode === item ? "bg-[var(--card-2)] text-white" : "text-[var(--fg-muted)]"
            }`}
          >
            {item === "login" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>
      {!enabled && (
        <p className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-xs leading-5 text-[var(--fg-muted)]">
          Cloud accounts are disabled in this private preview. The Studio still
          works in zero-charge validation mode.
        </p>
      )}
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <label className="block text-sm">
          <span className="font-semibold">Work email</span>
          <input
            type="email"
            autoComplete="email"
            required
            disabled={!enabled}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--brand)]"
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Password</span>
          <input
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={8}
            required
            disabled={!enabled}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--brand)]"
          />
        </label>
        <button type="submit" disabled={busy || !enabled} className="btn btn-primary w-full disabled:opacity-60">
          {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-[var(--mint)]">{message}</p>}
      {error && <p className="mt-4 text-sm text-[var(--brand)]">{error}</p>}
      <p className="mt-5 text-xs leading-5 text-[var(--fg-dim)]">
        Accounts are used to keep credits, private toy references, and generation
        tasks in sync. By continuing you agree to the <Link className="underline" href="/terms">Terms</Link>.
      </p>
    </div>
  );
}
