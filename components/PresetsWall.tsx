import { PRESETS, CATEGORIES } from "@/lib/presets";
import { PresetPreviewCard } from "@/components/PresetPreviewCard";

// Higgsfield-style dense "viral presets" wall (COMPETITOR_SPEC, owner: Claude).
// Each card opens the Generate studio PREFILLED with that effect, with a small
// secondary link to the effect's SEO landing page. Honest content only — these
// are the real available effects, not fabricated community posts.
export function PresetsWall({
  heading = "Viral presets",
  subheading = "Tap a preset to open Generate with it loaded — or start from a Module job.",
}: {
  heading?: string;
  subheading?: string;
}) {
  return (
    <section className="container-x py-14">
      <div className="mb-8">
        <p className="section-label">Collection</p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
          {heading}
        </h2>
        <p className="mt-2 max-w-xl text-sm text-[var(--fg-muted)]">
          {subheading}{" "}
          <a href="/modules" className="font-semibold text-[var(--mint)] hover:underline">
            Toy Modules →
          </a>
        </p>
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
              {items.map((p) => <PresetPreviewCard key={p.slug} preset={p} />)}
            </div>
          </div>
        );
      })}
    </section>
  );
}
