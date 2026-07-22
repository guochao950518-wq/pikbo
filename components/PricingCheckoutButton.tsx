"use client";

import { useState } from "react";
import type { PlanId } from "@/lib/pricing";
import { track } from "@/lib/analytics";

export function PricingCheckoutButton({
  planId,
  label,
  featured,
  interval = "month",
}: {
  planId: PlanId;
  label: string;
  featured?: boolean;
  interval?: "month" | "year";
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    track("pricing_plan_select", { planId, interval });
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, interval }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setBusy(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={checkout}
        disabled={busy}
        className={`btn w-full disabled:opacity-60 ${
          featured ? "btn-primary" : "btn-ghost"
        }`}
      >
        {busy ? "Redirecting…" : label}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs text-[var(--brand)]">{error}</p>
      )}
    </div>
  );
}
