import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { CATEGORIES } from "@/lib/presets";
import { USE_CASES } from "@/lib/usecases";
import { TOY_TYPES } from "@/lib/toytypes";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-[var(--border)] bg-[var(--bg-soft)]">
      <div className="container-x py-12">
        <div className="grid gap-10 md:grid-cols-6">
          <div className="md:col-span-2">
            <Logo size={30} />

            <p className="mt-3 max-w-xs text-sm text-[var(--fg-dim)]">
              {site.tagline} Video-first studio for toys you own.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--fg-dim)]">
              Effects
            </h4>
            <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
              <li>
                <Link href="/effects" className="hover:text-[var(--mint)]">
                  All presets
                </Link>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/effects#${c.id}`}
                    className="hover:text-[var(--mint)]"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--fg-dim)]">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
              {[
                ["/create", "Generate"],
                ["/library", "Library"],
                ["/pricing", "Pricing"],
                ["/effects", "Presets"],
                ["/tools", "Tools"],
                ["/guides", "Guides"],
                ["/privacy", "Privacy"],
                ["/terms", "Terms"],
              ].map(([h, l]) => (
                <li key={h}>
                  <Link href={h} className="hover:text-[var(--mint)]">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--fg-dim)]">
              For
            </h4>
            <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
              {USE_CASES.map((u) => (
                <li key={u.slug}>
                  <Link
                    href={`/for/${u.slug}`}
                    className="hover:text-[var(--mint)]"
                  >
                    {u.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--fg-dim)]">
              Toys
            </h4>
            <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
              {TOY_TYPES.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/toys/${t.slug}`}
                    className="hover:text-[var(--mint)]"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-[var(--border)] pt-6 text-xs text-[var(--fg-dim)]">
          © {new Date().getFullYear()} {site.name} · {site.domain}
        </div>
      </div>
    </footer>
  );
}
