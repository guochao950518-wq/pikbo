"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { CreditsBadge } from "@/components/CreditsBadge";

const NAV = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/create", label: "Generate", icon: "✦" },
  { href: "/effects", label: "Presets", icon: "▦" },
  { href: "/library", label: "Library", icon: "▢" },
  { href: "/community", label: "Community", icon: "◎" },
  { href: "/pricing", label: "Pricing", icon: "$" },
  { href: "/profile", label: "Profile", icon: "○" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/";

  // Marketing-ish pages still use shell; legal pages too for consistency
  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Desktop sidebar — Higgsfield-class app chrome */}
      <aside className="sticky top-0 hidden h-screen w-[72px] shrink-0 flex-col items-center border-r border-[var(--border)] bg-[var(--bg-soft)] py-4 lg:flex xl:w-[220px] xl:items-stretch xl:px-3">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2 xl:justify-start xl:px-2"
        >
          <span
            className="grid h-10 w-10 place-items-center rounded-xl text-lg font-bold"
            style={{ background: "var(--grad)" }}
          >
            P
          </span>
          <span className="hidden text-lg font-bold xl:inline">{site.name}</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? path === "/"
                : path === item.href || path.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center gap-3 rounded-xl px-0 py-3 text-sm font-medium transition-colors xl:justify-start xl:px-3 ${
                  active
                    ? "bg-[var(--card)] text-[var(--fg)] ring-1 ring-[var(--brand)]/40"
                    : "text-[var(--fg-muted)] hover:bg-[var(--card)] hover:text-[var(--fg)]"
                }`}
              >
                <span className="text-base opacity-80">{item.icon}</span>
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden xl:block">
          <CreditsBadge />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] px-4 backdrop-blur-md lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span
              className="grid h-8 w-8 place-items-center rounded-lg text-sm"
              style={{ background: "var(--grad)" }}
            >
              P
            </span>
            {site.name}
          </Link>
          <div className="flex items-center gap-2">
            <CreditsBadge />
            <Link href="/create" className="btn btn-primary px-3 py-1.5 text-xs">
              Generate
            </Link>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        {/* Mobile bottom nav */}
        <nav className="sticky bottom-0 z-40 flex border-t border-[var(--border)] bg-[var(--bg-soft)] lg:hidden">
          {NAV.slice(0, 5).map((item) => {
            const active =
              item.href === "/"
                ? path === "/"
                : path === item.href || path.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] ${
                  active ? "text-[var(--brand)]" : "text-[var(--fg-dim)]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
