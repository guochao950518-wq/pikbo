import Link from "next/link";
import { site } from "@/lib/site";
import { CATEGORIES } from "@/lib/presets";
import { USE_CASES } from "@/lib/usecases";
import { TOY_TYPES } from "@/lib/toytypes";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-white">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-9 w-9 place-items-center rounded-full text-xs font-black text-white"
                style={{ background: "var(--grad)" }}
              >
                P
              </span>
              <span className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
                {site.name}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--fg-muted)]">
              {site.tagline}. Premium motion for designer toys you already own.
            </p>
          </div>

          <div>
            <h4 className="section-label mb-4">Effects</h4>
            <ul className="space-y-2.5 text-sm text-[var(--fg-muted)]">
              <li>
                <Link href="/effects" className="hover:text-[var(--fg)]">
                  All presets
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
            <h4 className="section-label mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-[var(--fg-muted)]">
              <li>
                <Link href="/create" className="hover:text-[var(--fg)]">
                  Create
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[var(--fg)]">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/supercomputer" className="hover:text-[var(--fg)]">
                  Batch
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-[var(--fg)]">
                  Library
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-[var(--fg)]">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[var(--fg)]">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[var(--fg)]">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="section-label mb-4">For</h4>
            <ul className="space-y-2.5 text-sm text-[var(--fg-muted)]">
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
            <h4 className="section-label mb-4">Toys</h4>
            <ul className="space-y-2.5 text-sm text-[var(--fg-muted)]">
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

        <div className="mt-14 flex flex-col gap-2 border-t border-[var(--border)] pt-8 text-xs text-[var(--fg-dim)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Animate toys you own.
          </p>
          <p className="tracking-wide">{site.domain}</p>
        </div>
      </div>
    </footer>
  );
}
