import Link from "next/link";

export function TrustStrip() {
  return (
    <section className="border-y border-[var(--border)] bg-white px-4 py-5 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center text-xs tracking-wide text-[var(--fg-muted)]">
        <span>
          Powered by{" "}
          <strong className="font-semibold text-[var(--fg)]">Seedance</strong>
        </span>
        <span className="hidden h-3 w-px bg-[var(--border)] sm:block" />
        <span>Toys you own</span>
        <span className="hidden h-3 w-px bg-[var(--border)] sm:block" />
        <span>Free: one Mini 5s 480p trial · on-player mark</span>
        <span className="hidden h-3 w-px bg-[var(--border)] sm:block" />
        <span>
          Made for{" "}
          <Link
            href="/for/etsy-listing-videos"
            className="font-medium text-[var(--fg)] underline-offset-2 hover:underline"
          >
            Etsy
          </Link>
          {" · "}
          <Link
            href="/for/tiktok-shop-product-videos"
            className="font-medium text-[var(--fg)] underline-offset-2 hover:underline"
          >
            TikTok Shop
          </Link>
        </span>
      </div>
    </section>
  );
}
