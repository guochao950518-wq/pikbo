import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRESETS, getPreset } from "@/lib/presets";
import { PresetCard } from "@/components/PresetCard";
import { site } from "@/lib/site";

// Pre-render every effect page at build time -> static, fast, indexable.
export function generateStaticParams() {
  return PRESETS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const preset = getPreset(slug);
  if (!preset) return {};
  return {
    // seoTitle already includes the brand, so bypass the layout template
    title: { absolute: preset.seoTitle },
    description: preset.seoDescription,
    alternates: { canonical: `/effects/${preset.slug}` },
    openGraph: {
      title: preset.seoTitle,
      description: preset.seoDescription,
      url: `${site.url}/effects/${preset.slug}`,
    },
  };
}

export default async function EffectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const preset = getPreset(slug);
  if (!preset) notFound();

  const related = PRESETS.filter((p) => p.slug !== preset.slug).slice(0, 3);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preset.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="glow-bg">
        <div className="container-x relative z-10 grid items-center gap-10 pt-16 pb-12 md:grid-cols-2">
          <div>
            <Link
              href="/#effects"
              className="block w-fit text-sm text-[var(--fg-dim)] hover:text-[var(--fg)]"
            >
              ← All effects
            </Link>
            <span className="chip mt-4">
              {preset.emoji}{" "}
              {preset.audience === "seller" ? "For sellers" : "For collectors"}
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              {preset.h1}
            </h1>
            <p className="mt-4 text-lg text-[var(--fg-muted)]">{preset.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/create?effect=${preset.slug}`}
                className="btn btn-primary"
              >
                Try this effect →
              </Link>
              <Link href="/#pricing" className="btn btn-ghost">
                See pricing
              </Link>
            </div>
          </div>
          <div
            className="grid aspect-square place-items-center rounded-3xl text-8xl"
            style={{ background: preset.gradient }}
          >
            <span className="drop-shadow-xl">{preset.emoji}</span>
          </div>
        </div>
      </section>

      {/* Body copy */}
      <section className="container-x py-12">
        <div className="max-w-2xl space-y-5 text-[var(--fg-muted)]">
          {preset.body.map((para, i) => (
            <p key={i} className="leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* keyword pills (light internal SEO signal) */}
        <div className="mt-8 flex flex-wrap gap-2">
          {preset.keywords.map((k) => (
            <span key={k} className="chip">
              {k}
            </span>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x py-8">
        <h2 className="text-2xl font-bold">Questions</h2>
        <div className="mt-6 divide-y divide-[var(--border)]">
          {preset.faq.map((f) => (
            <div key={f.q} className="py-5">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-1.5 text-[var(--fg-muted)]">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="container-x py-12">
        <h2 className="text-2xl font-bold">More effects</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <PresetCard key={p.slug} preset={p} />
          ))}
        </div>
      </section>
    </>
  );
}
