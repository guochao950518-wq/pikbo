import { PRESETS, CATEGORIES } from "@/lib/presets";
import { PresetPreviewCard } from "@/components/PresetPreviewCard";

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
              {items.map((p) => <PresetPreviewCard key={p.slug} preset={p} />)}
            </div>
          </div>
        );
      })}
    </section>
  );
}
