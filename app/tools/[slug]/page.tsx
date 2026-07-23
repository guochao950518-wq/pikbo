import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS, getTool } from "@/lib/tools";
import { COMMON_FAQ, getPreset } from "@/lib/presets";
import { PresetCard } from "@/components/PresetCard";
import { LandingToolPanel } from "@/components/LandingToolPanel";
import { LandingHowItWorks } from "@/components/LandingHowItWorks";
import { LandingResults } from "@/components/LandingResults";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getTool(slug);
  if (!t) return {};
  return {
    title: { absolute: t.seoTitle },
    description: t.seoDescription,
    alternates: { canonical: `/tools/${t.slug}` },
    openGraph: {
      title: t.seoTitle,
      description: t.seoDescription,
      url: `${site.url}/tools/${t.slug}`,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = getTool(slug);
  if (!t) notFound();

  const primary = getPreset(t.primaryEffect);
  const effects = t.effects
    .map((s) => getPreset(s))
    .filter((p) => p !== undefined);

  const allFaq = [...t.faq, ...COMMON_FAQ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaq.map((f) => ({
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

      <section className="glow-bg">
        <div className="container-x relative z-10 pt-14 pb-8">
          <span className="chip">
            {t.emoji} {t.label} · Tool
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            {t.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--fg-muted)]">
            {t.intro}
          </p>
        </div>
      </section>

      {primary && (
        <section className="container-x py-8">
          <LandingToolPanel
            effectSlug={primary.slug}
            effectName={primary.name}
            duration={primary.duration}
            aspectRatio={primary.aspectRatio}
          />
        </section>
      )}

      <LandingHowItWorks productLabel="toy clip" />

      <section className="container-x py-10">
        <h2 className="text-2xl font-bold">How this tool works</h2>
        <div className="mt-5 max-w-2xl space-y-5 text-[var(--fg-muted)]">
          {t.body.map((para, i) => (
            <p key={i} className="leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </section>

      <LandingResults effectSlug={primary?.slug} title="Example clips" />

      <section className="container-x py-8">
        <h2 className="text-2xl font-bold">Recipes for this tool</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {effects.map((p) => (
            <PresetCard key={p.slug} preset={p} />
          ))}
        </div>
      </section>

      <section className="container-x py-8">
        <h2 className="text-2xl font-bold">Questions</h2>
        <div className="mt-6 divide-y divide-[var(--border)]">
          {allFaq.map((f) => (
            <div key={f.q} className="py-5">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-1.5 text-[var(--fg-muted)]">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-10">
        <h2 className="text-2xl font-bold">More tools</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {TOOLS.filter((x) => x.slug !== t.slug).map((x) => (
            <Link key={x.slug} href={`/tools/${x.slug}`} className="chip">
              {x.emoji} {x.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
