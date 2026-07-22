import Link from "next/link";

/** HF model/app chip rail under the promo carousel */
const TOOLS = [
  {
    href: "/create",
    label: "Seedance",
    sub: "Toy → video",
    emoji: "✦",
    hot: true,
  },
  {
    href: "/effects",
    label: "Presets",
    sub: "Viral recipes",
    emoji: "▶",
  },
  {
    href: "/supercomputer",
    label: "Batch",
    sub: "Seller packs",
    emoji: "⚡",
  },
  {
    href: "/image",
    label: "Image",
    sub: "Still studio",
    emoji: "▣",
  },
  {
    href: "/cinema",
    label: "Cinema",
    sub: "Longer looks",
    emoji: "◎",
  },
  {
    href: "/guides",
    label: "Learn",
    sub: "How-to free",
    emoji: "◎",
  },
  {
    href: "/models",
    label: "Models",
    sub: "What's live",
    emoji: "◎",
  },
  {
    href: "/community",
    label: "Lab",
    sub: "Watch more",
    emoji: "◉",
  },
] as const;

export function HomeToolShelf() {
  return (
    <section className="border-b border-[var(--border)] px-3 py-3 sm:px-5">
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TOOLS.map((t) => (
          <Link
            key={t.href + t.label}
            href={t.href}
            className={`flex min-w-[128px] shrink-0 items-center gap-2.5 rounded-2xl border px-3 py-2.5 transition hover:border-white/20 hover:bg-white/[0.04] ${
              t.hot
                ? "border-[var(--mint)]/40 bg-[var(--mint)]/10"
                : "border-[var(--border)] bg-white/[0.02]"
            }`}
          >
            <span
              className={`grid h-9 w-9 place-items-center rounded-xl text-sm ${
                t.hot
                  ? "bg-[var(--mint)] font-black text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              {t.emoji}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[12px] font-bold text-[var(--fg)]">
                {t.label}
              </span>
              <span className="block truncate text-[10px] text-[var(--fg-dim)]">
                {t.sub}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
