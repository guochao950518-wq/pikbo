"use client";

import { useEffect, useState } from "react";

type Health = {
  ok?: boolean;
  degraded?: boolean;
  mode?: string;
  fal?: boolean;
  sessionSecret?: boolean;
  ready?: {
    demo?: boolean;
    softLive?: boolean;
    paid?: boolean;
    durableCredits?: boolean;
  };
  t6?: { status?: string };
  forceGenerateFail?: boolean;
  rateLimit?: {
    inflight?: number;
    inflightTtlMs?: number;
  };
  assets?: {
    mode?: string;
    count?: number;
    ttlMs?: number;
    note?: string;
  };
  jobs?: {
    mode?: string;
    count?: number;
    jobTimeoutMs?: number;
    note?: string;
  };
  videoWebhook?: {
    secretConfigured?: boolean;
    requiresSecretInProduction?: boolean;
  };
};

export function StatusProbe() {
  const [data, setData] = useState<Health | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const json = (await res.json()) as Health;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setErr("Could not reach /api/health");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (err) {
    return (
      <p className="mt-6 text-sm text-amber-200" role="alert">
        {err}
      </p>
    );
  }
  if (!data) {
    return (
      <p className="mt-6 text-sm text-[var(--fg-dim)]">Loading health…</p>
    );
  }

  const rows: Array<[string, string, boolean?]> = [
    ["Overall", data.ok ? "ok" : "degraded", data.ok],
    ["Mode", String(data.mode ?? "—")],
    ["Demo path", data.ready?.demo ? "ready" : "no", data.ready?.demo],
    [
      "Soft-live (FAL)",
      data.ready?.softLive ? "ready" : "no",
      data.ready?.softLive,
    ],
    ["Paid", data.ready?.paid ? "ready" : "off (expected)", data.ready?.paid],
    [
      "Durable credits",
      data.ready?.durableCredits ? "on" : "local/off",
      data.ready?.durableCredits,
    ],
    ["Session secret", data.sessionSecret ? "set" : "missing", data.sessionSecret],
    ["FAL key", data.fal ? "set" : "missing", data.fal],
    ["T6 watermark bake", data.t6?.status ?? "unknown"],
    [
      "In-flight jobs",
      typeof data.rateLimit?.inflight === "number"
        ? `${data.rateLimit.inflight} (TTL ${Math.round((data.rateLimit.inflightTtlMs ?? 0) / 1000)}s)`
        : "—",
    ],
    [
      "Local still assets",
      typeof data.assets?.count === "number"
        ? `${data.assets.count} · TTL ${Math.round((data.assets.ttlMs ?? 0) / 60000)}m slide`
        : "—",
    ],
    [
      "Session job ledger",
      typeof data.jobs?.count === "number"
        ? `${data.jobs.count} · timeout ${Math.round((data.jobs.jobTimeoutMs ?? 0) / 60000)}m`
        : "—",
    ],
    [
      "Video webhook secret",
      data.videoWebhook?.secretConfigured
        ? "set"
        : "missing (prod refuses unsigned)",
      data.videoWebhook?.secretConfigured,
    ],
  ];

  return (
    <dl className="mt-6 space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">
      {rows.map(([k, v, good]) => (
        <div key={k} className="flex justify-between gap-4">
          <dt className="text-[var(--fg-dim)]">{k}</dt>
          <dd
            className={
              good === true
                ? "font-semibold text-[var(--mint)]"
                : good === false
                  ? "font-semibold text-white/70"
                  : "text-white/80"
            }
          >
            {v}
          </dd>
        </div>
      ))}
    </dl>
  );
}
