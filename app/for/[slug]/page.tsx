import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { USE_CASES, getUseCase } from "@/lib/usecases";
import { getPreset } from "@/lib/presets";
import { PresetCard } from "@/components/PresetCard";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return USE_CASES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const uc = getUseCase(slug);
  if (!uc) return {};
  return {
    title: { absolute: uc.seoTitle },
    description: uc.seoDescription,
    alternates: { canonical: `/for/${uc.slug}` },
    openGraph: {
      title: uc.seoTitle,
      description: uc.seoDescription,
      url: `${site.url}/for/${uc.slug}`,
    },
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uc = getUseCase(slug);
  if (!uc) notFound();

  const effects = uc.recommendedEffects
    .map((s) => getPreset(s))
    .filter((p) => p !== undefined);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: uc.faq.map((f) => ({
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
        <div className="container-x relative z-10 pt-16 pb-10">
          <span className="chip">
            {uc.emoji} For {uc.audience === "seller" ? "sellers" : "collectors"}
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            {uc.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--fg-muted)]">
            {uc.intro}
          </p>
          <Link href="/create" className="btn btn-primary mt-7">
            Create a clip →
          </Link>
        </div>
      </section>

      <section className="container-x py-10">
        <div className="max-w-2xl space-y-5 text-[var(--fg-muted)]">
          {uc.body.map((para, i) => (
            <p key={i} className="leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* cross-link to effect pages */}
      <section className="container-x py-8">
        <h2 className="text-2xl font-bold">Best effects for this</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {effects.map((p) => (
            <PresetCard key={p.slug} preset={p} />
          ))}
        </div>
      </section>

      <section className="container-x py-8">
        <h2 className="text-2xl font-bold">Questions</h2>
        <div className="mt-6 divide-y divide-[var(--border)]">
          {uc.faq.map((f) => (
            <div key={f.q} className="py-5">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-1.5 text-[var(--fg-muted)]">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* link to other use cases */}
      <section className="container-x py-10">
        <h2 className="text-2xl font-bold">Also made for</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {USE_CASES.filter((u) => u.slug !== uc.slug).map((u) => (
            <Link key={u.slug} href={`/for/${u.slug}`} className="chip">
              {u.emoji} {u.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
