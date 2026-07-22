import Link from "next/link";
import { site } from "@/lib/site";
import { CATEGORIES } from "@/lib/presets";
import { USE_CASES } from "@/lib/usecases";
import { TOY_TYPES } from "@/lib/toytypes";

// The footer doubles as an internal-linking hub for SEO — every effect page
// is linked from every page. This is the pSEO backbone.
export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span
                className="grid h-8 w-8 place-items-center rounded-xl"
                style={{ background: "var(--grad)" }}
              >
                🧸
              </span>
              {site.name}
            </div>
            <p className="mt-3 text-sm text-[var(--fg-dim)] max-w-xs">
              {site.tagline}. Made for collectors and toy sellers.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Effects</h4>
            <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
              <li>
                <Link href="/effects" className="hover:text-[var(--fg)]">
                  All effects
                </Link>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/effects#${c.id}`}
                    className="hover:text-[var(--fg)]"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
              <li>
                <Link href="/create" className="hover:text-[var(--fg)]">
                  Create a clip
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[var(--fg)]">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#how" className="hover:text-[var(--fg)]">
                  How it works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">For</h4>
            <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
              {USE_CASES.map((u) => (
                <li key={u.slug}>
                  <Link
                    href={`/for/${u.slug}`}
                    className="hover:text-[var(--fg)]"
                  >
                    {u.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Toys</h4>
            <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
              {TOY_TYPES.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/toys/${t.slug}`}
                    className="hover:text-[var(--fg)]"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--border)] pt-6 text-xs text-[var(--fg-dim)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Animate the toys you own —
            upload your own photos.
          </p>
          <p>{site.domain}</p>
        </div>
      </div>
    </footer>
  );
}
