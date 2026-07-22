/** 哥飞 V2 — 落地文案块：SSR 步骤，给用户 + 爬虫 */
export function LandingHowItWorks({
  productLabel = "clip",
}: {
  productLabel?: string;
}) {
  const steps = [
    {
      n: "1",
      t: "Upload one photo",
      d: "A clear shot of a designer toy, figure, or blind-box pull you own. Plain background works best.",
    },
    {
      n: "2",
      t: "Use the tool on this page",
      d: `No extra hop. Generate the ${productLabel} right here — same URL Google ranks.`,
    },
    {
      n: "3",
      t: "Download & post",
      d: "Export for TikTok, Etsy, Whatnot, or shelf flex. Free plan includes an on-player mark.",
    },
  ];

  return (
    <section className="container-x py-12">
      <h2 className="text-2xl font-bold">How it works</h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--fg-muted)]">
        Built as a V2 tool landing page: the generator, the explanation, and
        sample results live together so searchers and crawlers both understand
        the page.
      </p>
      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {steps.map((s) => (
          <li key={s.n} className="card p-5">
            <span
              className="grid h-8 w-8 place-items-center rounded-full text-sm font-bold text-white"
              style={{ background: "var(--grad)" }}
            >
              {s.n}
            </span>
            <h3 className="mt-3 font-semibold">{s.t}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--fg-muted)]">
              {s.d}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
