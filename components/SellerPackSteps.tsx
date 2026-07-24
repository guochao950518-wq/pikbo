"use client";

/**
 * HF Product / Marketing Studio three-step pattern — toy seller vertical.
 * Pure presentation; parent owns state.
 */
export function SellerPackSteps({
  step,
}: {
  /** 1 upload · 2 run · 3 deliver */
  step: 1 | 2 | 3;
}) {
  const items = [
    { n: 1 as const, label: "Upload", blurb: "One owned toy photo" },
    {
      n: 2 as const,
      label: "Generate pack",
      blurb: "3 clips · 10 credits each (30 live)",
    },
    { n: 3 as const, label: "Deliver", blurb: "Download · post · export" },
  ];

  return (
    <ol className="mt-5 grid gap-2 sm:grid-cols-3">
      {items.map((it) => {
        const active = step === it.n;
        const done = step > it.n;
        return (
          <li
            key={it.n}
            className={`rounded-xl border px-3 py-2.5 ${
              active
                ? "border-[var(--mint)]/50 bg-[var(--mint)]/[0.1]"
                : done
                  ? "border-white/15 bg-white/[0.04]"
                  : "border-white/10 bg-black/20 opacity-70"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-black ${
                  active || done
                    ? "bg-[var(--mint)] text-black"
                    : "bg-white/10 text-white/50"
                }`}
              >
                {done ? "✓" : it.n}
              </span>
              <span
                className={`text-sm font-bold ${
                  active ? "text-[var(--mint)]" : "text-white/80"
                }`}
              >
                {it.label}
              </span>
            </div>
            <p className="mt-1 pl-8 text-[11px] text-white/45">{it.blurb}</p>
          </li>
        );
      })}
    </ol>
  );
}
