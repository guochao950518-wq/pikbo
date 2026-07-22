import Link from "next/link";

const STEPS = [
  {
    n: "1",
    t: "Snap your figure",
    d: "One clear photo — full toy, even light, clean background.",
  },
  {
    n: "2",
    t: "Pick a toy preset",
    d: "Spin, unbox, dance, shelf pan — or direct it in Cinema.",
  },
  {
    n: "3",
    t: "Generate with Seedance",
    d: "ByteDance motion that keeps paint and sculpt readable.",
  },
  {
    n: "4",
    t: "Post or list",
    d: "TikTok, Etsy, Whatnot, Instagram — download and ship.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-[var(--border)] bg-white px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="section-label text-center">Process</p>
        <h2 className="mt-2 text-center font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
          How it works
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-sm text-[var(--fg-muted)]">
          Four steps from shelf photo to post-ready clip
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-6">
              <span className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand)]">
                {s.n.padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-semibold tracking-tight">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
                {s.d}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/create" className="btn btn-primary">
            Try with your figure
          </Link>
        </div>
      </div>
    </section>
  );
}
