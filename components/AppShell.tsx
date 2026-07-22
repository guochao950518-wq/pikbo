"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { CreditsBadge } from "@/components/CreditsBadge";
import { MobileGenerateBar } from "@/components/MobileGenerateBar";
import { OnboardingBanner } from "@/components/OnboardingBanner";
import { CommandPalette } from "@/components/CommandPalette";
import { ToastProvider } from "@/components/Toast";
import { StatusBadge } from "@/components/StatusBadge";

/** Primary product path first; suite extras below. */
const NAV = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/create", label: "Generate", icon: "✦" },
  { href: "/effects", label: "Presets", icon: "🧸" },
  { href: "/library", label: "Library", icon: "▢" },
  { href: "/image", label: "Stills", icon: "🖼" },
  { href: "/cinema", label: "Cinema", icon: "🎞" },
  { href: "/supercomputer", label: "Batch", icon: "⚡" },
  { href: "/guides", label: "Guides", icon: "📖" },
  { href: "/apps", label: "Apps", icon: "▦" },
  { href: "/models", label: "Models", icon: "◎" },
  { href: "/explore", label: "Explore", icon: "✧" },
  { href: "/community", label: "Community", icon: "◉" },
  { href: "/pricing", label: "Pricing", icon: "$" },
  { href: "/profile", label: "Profile", icon: "○" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/";

  return (
    <ToastProvider>
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <aside className="sticky top-0 z-50 hidden h-screen w-[72px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-soft)] py-3 lg:flex xl:w-[200px] xl:px-2">
        <Link
          href="/"
          className="mb-4 flex items-center justify-center gap-2 xl:justify-start xl:px-2"
        >
          <span
            className="grid h-9 w-9 place-items-center rounded-xl text-sm font-black text-white shadow-lg"
            style={{ background: "var(--grad)", boxShadow: "var(--brand-glow)" }}
          >
            🧸
          </span>
          <span className="hidden text-base font-bold tracking-tight xl:inline">
            {site.name}
          </span>
        </Link>
        <div className="mb-3 hidden px-2 xl:block">
          <StatusBadge />
        </div>

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
                className={`flex items-center justify-center gap-2.5 rounded-xl px-0 py-2.5 text-[13px] font-medium transition-colors xl:justify-start xl:px-2.5 ${
                  active
                    ? "bg-[var(--grad-soft)] text-[var(--fg)] ring-1 ring-[var(--brand)]/35"
                    : "text-[var(--fg-muted)] hover:bg-[var(--card)] hover:text-[var(--fg)]"
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

        <div className="mt-2 hidden border-t border-[var(--border)] pt-3 xl:block">
          <CreditsBadge />
          <Link href="/create" className="btn btn-primary mt-3 w-full py-2 text-xs">
            Generate
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] px-3 backdrop-blur-md lg:hidden">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold">
            <span
              className="grid h-7 w-7 place-items-center rounded-lg text-xs"
              style={{ background: "var(--grad)" }}
            >
              🧸
            </span>
            {site.name}
          </Link>
          <div className="flex items-center gap-2">
            <CreditsBadge />
            <Link href="/create" className="btn btn-primary px-3 py-1 text-xs">
              Generate
            </Link>
          </div>
        </header>

        <OnboardingBanner />
        <CommandPalette />
        <div className="flex-1">{children}</div>
        <MobileGenerateBar />

        <nav className="sticky bottom-0 z-40 flex border-t border-[var(--border)] bg-[var(--bg-soft)] lg:hidden">
          {NAV.slice(0, 6).map((item) => {
            const active =
              item.href === "/"
                ? path === "/"
                : path === item.href || path.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2 text-[9px] ${
                  active ? "text-[var(--brand)]" : "text-[var(--fg-dim)]"
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
    </ToastProvider>
  );
}
