import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms for using ${site.name}, the designer toy video maker.`,
};

export default function TermsPage() {
  return (
    <div className="container-x py-16 max-w-3xl">
      <h1 className="text-4xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-[var(--fg-dim)]">
        Last updated: July 22, 2026 · {site.domain}
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-[var(--fg-muted)]">
        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">The service</h2>
          <p className="mt-2">
            {site.name} lets you turn photos of designer toys, figures, and collectibles
            into short videos using AI. Features and credit allowances may change.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">Your content</h2>
          <p className="mt-2">
            You must only upload photos you have the right to use (typically toys you own).
            You keep rights to your original photos. You grant us a limited license to
            process them for generation. You are responsible for how you use exported clips.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">Credits & plans</h2>
          <p className="mt-2">
            Free plans include a watermark and limited credits. Paid plans are billed by
            Stripe on a subscription basis. Credits do not guarantee unlimited generation
            if abuse or cost spikes occur; we may rate-limit to protect the service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">Acceptable use</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>No illegal content, no impersonation of brands you do not represent.</li>
            <li>No attempts to reverse-engineer, scrape, or overload the API.</li>
            <li>No generating content that infringes others&apos; IP as the primary purpose.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">Disclaimer</h2>
          <p className="mt-2">
            The service is provided &quot;as is&quot;. AI outputs may contain artifacts.
            {site.name} is not affiliated with any toy manufacturer or brand.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">Contact</h2>
          <p className="mt-2">
            legal@{site.domain.replace(/^www\./, "")}
          </p>
        </section>
      </div>
    </div>
  );
}
