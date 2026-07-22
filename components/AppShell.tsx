"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { CreditsBadge } from "@/components/CreditsBadge";

/** Full suite nav — mirrors Higgsfield-class apps (Home, Generate, Apps, …) */
const NAV = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/create", label: "Generate", icon: "✦" },
  { href: "/apps", label: "Apps", icon: "▦" },
  { href: "/models", label: "Models", icon: "◎" },
  { href: "/cinema", label: "Cinema", icon: "🎞" },
  { href: "/effects", label: "Presets", icon: "⚡" },
  { href: "/library", label: "Library", icon: "▢" },
  { href: "/community", label: "Community", icon: "◉" },
  { href: "/pricing", label: "Pricing", icon: "$" },
  { href: "/profile", label: "Profile", icon: "○" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/";

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <aside className="sticky top-0 z-50 hidden h-screen w-[72px] shrink-0 flex-col border-r border-[var(--border)] bg-[#0a0a0c] py-3 lg:flex xl:w-[200px] xl:px-2">
        <Link
          href="/"
          className="mb-4 flex items-center justify-center gap-2 xl:justify-start xl:px-2"
        >
          <span
            className="grid h-9 w-9 place-items-center rounded-lg text-sm font-black text-black"
            style={{ background: "var(--lime)" }}
          >
            P
          </span>
          <span className="hidden text-base font-bold tracking-tight xl:inline">
            {site.name}
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? path === "/"
                : path === item.href || path.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center gap-2.5 rounded-lg px-0 py-2.5 text-[13px] font-medium transition-colors xl:justify-start xl:px-2.5 ${
                  active
                    ? "bg-white/10 text-[var(--lime)]"
                    : "text-white/55 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="w-5 text-center text-sm opacity-90">
                  {item.icon}
                </span>
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-2 hidden border-t border-white/10 pt-3 xl:block">
          <CreditsBadge />
          <Link
            href="/create"
            className="mt-3 flex w-full items-center justify-center rounded-full bg-[var(--lime)] py-2 text-xs font-bold text-black"
          >
            Generate
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-[var(--border)] bg-black/80 px-3 backdrop-blur-md lg:hidden">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold">
            <span
              className="grid h-7 w-7 place-items-center rounded-md text-xs font-black text-black"
              style={{ background: "var(--lime)" }}
            >
              P
            </span>
            {site.name}
          </Link>
          <div className="flex items-center gap-2">
            <CreditsBadge />
            <Link
              href="/create"
              className="rounded-full bg-[var(--lime)] px-3 py-1 text-xs font-bold text-black"
            >
              Generate
            </Link>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <nav className="sticky bottom-0 z-40 flex overflow-x-auto border-t border-[var(--border)] bg-[#0a0a0c] lg:hidden">
          {NAV.slice(0, 6).map((item) => {
            const active =
              item.href === "/"
                ? path === "/"
                : path === item.href || path.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-[4.2rem] flex-1 flex-col items-center gap-0.5 py-2 text-[9px] ${
                  active ? "text-[var(--lime)]" : "text-white/45"
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
