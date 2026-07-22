import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRESETS, getPreset } from "@/lib/presets";
import { USE_CASES } from "@/lib/usecases";
import { PresetCard } from "@/components/PresetCard";
import { LandingToolPanel } from "@/components/LandingToolPanel";
import { LandingHowItWorks } from "@/components/LandingHowItWorks";
import { LandingResults } from "@/components/LandingResults";
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
    title: { absolute: preset.seoTitle },
    description: preset.seoDescription,
    keywords: preset.keywords,
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

  const related = PRESETS.filter(
    (p) => p.slug !== preset.slug && p.category === preset.category
  ).slice(0, 3);
  const relatedFallback =
    related.length > 0
      ? related
      : PRESETS.filter((p) => p.slug !== preset.slug).slice(0, 3);

  const forLinks = USE_CASES.filter((u) =>
    u.recommendedEffects.includes(preset.slug)
  ).slice(0, 4);

  // 哥飞 V2: FAQ + HowTo + SoftwareApplication JSON-LD (SSR)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preset.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: preset.h1,
    description: preset.seoDescription,
    step: [
      {
        "@type": "HowToStep",
        name: "Upload a photo of your toy",
        text: "Use a clear product photo of a designer toy or figure you own.",
      },
      {
        "@type": "HowToStep",
        name: `Generate ${preset.name}`,
        text: `Run the ${preset.name} tool on this page to create a short video.`,
      },
      {
        "@type": "HowToStep",
        name: "Download and publish",
        text: "Export the clip for listings, TikTok, or shelf posts.",
      },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${preset.name} — ${site.name}`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier with monthly credits",
    },
    description: preset.seoDescription,
    url: `${site.url}/effects/${preset.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />

      {/* Hero — H1 + intro SSR for crawlers */}
      <section className="glow-bg">
        <div className="container-x relative z-10 pt-14 pb-8">
          <Link
            href="/effects"
            className="block w-fit text-sm text-[var(--fg-dim)] hover:text-[var(--fg)]"
          >
            ← All effects
          </Link>
          <span className="chip mt-4">
            {preset.emoji}{" "}
            {preset.audience === "seller" ? "For sellers" : "For collectors"} ·
            Tool landing
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            {preset.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--fg-muted)]">
            {preset.intro}
          </p>
        </div>
      </section>

      {/* V2: tool on same page as landing copy */}
      <section className="container-x py-8">
        <LandingToolPanel
          effectSlug={preset.slug}
          effectName={preset.name}
          duration={preset.duration}
          aspectRatio={preset.aspectRatio}
        />
      </section>

      <LandingHowItWorks productLabel={preset.name.toLowerCase()} />

      {/* Body copy — SSR long text for crawlers (哥飞 V2 落地文案) */}
      <section className="container-x py-10">
        <h2 className="text-2xl font-bold">About this effect</h2>
        <div className="mt-5 max-w-2xl space-y-5 text-[var(--fg-muted)]">
          {preset.body.map((para, i) => (
            <p key={i} className="leading-relaxed">
              {para}
            </p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {preset.keywords.map((k) => (
            <span key={k} className="chip">
              {k}
            </span>
          ))}
        </div>
      </section>

      {/* V2: result showcase */}
      <LandingResults
        effectSlug={preset.slug}
        title={`${preset.name} examples`}
      />

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

      {/* Internal links — 内链 */}
      {forLinks.length > 0 && (
        <section className="container-x py-8">
          <h2 className="text-2xl font-bold">Made for</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {forLinks.map((u) => (
              <Link key={u.slug} href={`/for/${u.slug}`} className="chip">
                {u.emoji} {u.label}
              </Link>
            ))}
            <Link href="/guides" className="chip">
              Guides →
            </Link>
          </div>
        </section>
      )}

      <section className="container-x py-12">
        <h2 className="text-2xl font-bold">More effects</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {relatedFallback.map((p) => (
            <PresetCard key={p.slug} preset={p} />
          ))}
        </div>
      </section>
    </>
  );
}
