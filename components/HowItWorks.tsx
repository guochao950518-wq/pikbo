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
    <section className="border-b border-[var(--border)] px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-bold">How it works</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-[var(--fg-muted)]">
          Pro AI suite flow — built for toys you already own
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-5">
              <span
                className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white"
                style={{ background: "var(--grad)" }}
              >
                {s.n}
              </span>
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-[var(--fg-muted)]">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/create" className="btn btn-primary">
            Try with your figure →
          </Link>
        </div>
      </div>
    </section>
  );
}
