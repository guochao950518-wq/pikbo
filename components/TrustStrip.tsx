import Link from "next/link";

/** Social proof / trust row for conversion */
export function TrustStrip() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg-soft)]/50 px-4 py-6 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-xs text-[var(--fg-muted)]">
        <span>
          <strong className="text-[var(--fg)]">Seedance</strong> by ByteDance
        </span>
        <span>Photo of toys you own only</span>
        <span>Free tier · watermarked</span>
        <span>
          Built for{" "}
          <Link href="/for/etsy-listing-videos" className="text-[var(--brand)] hover:underline">
            Etsy
          </Link>
          ,{" "}
          <Link href="/for/tiktok-shop-product-videos" className="text-[var(--brand)] hover:underline">
            TikTok Shop
          </Link>
          , collectors
        </span>
      </div>
    </section>
  );
}
