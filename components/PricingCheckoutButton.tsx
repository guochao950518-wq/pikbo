"use client";

import { useState } from "react";
import type { PlanId } from "@/lib/pricing";
import { Button } from "@/components/ui/button";

export function PricingCheckoutButton({
  planId,
  label,
  featured,
}: {
  planId: PlanId;
  label: string;
  featured?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
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
    <div className="w-full">
      <Button
        type="button"
        onClick={checkout}
        disabled={busy}
        variant={featured ? "default" : "secondary"}
        size="lg"
        className="w-full"
      >
        {busy ? "Redirecting…" : label}
      </Button>
      {error && (
        <p className="mt-2 text-center text-xs text-[var(--brand)]">{error}</p>
      )}
    </div>
  );
}
