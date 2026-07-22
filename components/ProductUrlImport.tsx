"use client";

import { useState } from "react";

type ImportedProduct = {
  sourceUrl: string;
  title: string;
  description: string;
  images: string[];
  frontImageDataUrl: string | null;
};

export function ProductUrlImport({
  onImported,
  compact = false,
}: {
  onImported: (product: ImportedProduct) => void;
  compact?: boolean;
}) {
  const [url, setUrl] = useState("");
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rightsConfirmed) {
      setError("Confirm that you own or may use this product page and its assets.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, rightsConfirmed: true }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        metadata?: ImportedProduct;
        error?: string;
        message?: string;
      };
      if (!response.ok || !payload.metadata) {
        throw new Error(payload.message || payload.error || "Product import failed.");
      }
      if (!payload.metadata.frontImageDataUrl) {
        throw new Error("No usable product image was found. Upload a front photo instead.");
      }
      onImported(payload.metadata);
      setResult(payload.metadata.title);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Product import failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className={compact ? "space-y-2" : "space-y-3"}>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor={compact ? "hero-product-url" : "studio-product-url"}>
          Product page URL
        </label>
        <input
          id={compact ? "hero-product-url" : "studio-product-url"}
          type="url"
          required
          inputMode="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://your-shop.com/product"
          className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-xs text-[var(--fg)] outline-none placeholder:text-[var(--fg-dim)] focus:border-[var(--mint)]"
        />
        <button type="submit" disabled={busy} className="btn btn-ghost shrink-0 px-3 py-2 text-[11px] disabled:opacity-50">
          {busy ? "Importing…" : "Import"}
        </button>
      </div>
      <label className="flex cursor-pointer items-start gap-2 text-[10px] leading-4 text-[var(--fg-dim)]">
        <input
          type="checkbox"
          checked={rightsConfirmed}
          onChange={(event) => setRightsConfirmed(event.target.checked)}
          className="mt-0.5 accent-[var(--mint)]"
        />
        <span>I own or am authorized to use the product page and imported image.</span>
      </label>
      {error && <p role="alert" className="text-[10px] leading-4 text-red-300">{error}</p>}
      {result && <p role="status" className="text-[10px] leading-4 text-[var(--mint)]">Imported: {result}</p>}
    </form>
  );
}
