import Link from "next/link";
import { PRESETS, CATEGORIES } from "@/lib/presets";

// Higgsfield-style dense "viral presets" wall (COMPETITOR_SPEC, owner: Claude).
// Each card opens the Generate studio PREFILLED with that effect, with a small
// secondary link to the effect's SEO landing page. Honest content only — these
// are the real available effects, not fabricated community posts.
export function PresetsWall({
  heading = "Viral presets",
  subheading = "Tap a preset to open the studio with it loaded.",
}: {
  heading?: string;
  subheading?: string;
}) {
  return (
    <section className="container-x py-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{heading}</h2>
        <p className="mt-1 text-[var(--fg-muted)]">{subheading}</p>
      </div>

      {/* category quick-nav */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <a key={c.id} href={`#wall-${c.id}`} className="chip hover:text-[var(--fg)]">
            {c.label}
          </a>
        ))}
      </div>

      {CATEGORIES.map((cat) => {
        const items = PRESETS.filter((p) => p.category === cat.id);
        return (
          <div key={cat.id} id={`wall-${cat.id}`} className="mb-10 scroll-mt-24">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--fg-dim)]">
              {cat.label}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((p) => (
                <div key={p.slug} className="group relative">
                  <Link
                    href={`/create?effect=${p.slug}`}
                    className="block overflow-hidden rounded-xl"
                  >
                    <div
                      className="relative grid aspect-[3/4] place-items-center text-4xl"
                      style={{ background: p.gradient }}
                    >
                      <span className="drop-shadow-lg">{p.emoji}</span>
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-left">
                        <span className="block text-sm font-semibold text-white">
                          {p.name}
                        </span>
                        <span className="block truncate text-[11px] text-white/70">
                          {p.tagline}
                        </span>
                      </span>
                      <span className="absolute right-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                        ▶ Use
                      </span>
                    </div>
                  </Link>
                  <Link
                    href={`/effects/${p.slug}`}
                    className="mt-1 block text-[11px] text-[var(--fg-dim)] hover:text-[var(--fg)]"
                  >
                    Learn more →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
