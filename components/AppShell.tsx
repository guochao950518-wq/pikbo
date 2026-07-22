"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { CreditsBadge } from "@/components/CreditsBadge";
import { OnboardingBanner } from "@/components/OnboardingBanner";
import { CommandPalette } from "@/components/CommandPalette";
import { ToastProvider } from "@/components/Toast";
import { StatusBadge } from "@/components/StatusBadge";
import { Footer } from "@/components/Footer";

const PRIMARY_NAV = [
  { href: "/create", label: "Create", icon: "✦" },
  { href: "/explore", label: "Explore", icon: "◫" },
  { href: "/effects", label: "Effects", icon: "▶" },
  { href: "/library", label: "Library", icon: "▢" },
] as const;

function isActive(path: string, href: string) {
  return path === href || path.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/";
  const isWorkspace =
    path.startsWith("/create") ||
    path.startsWith("/supercomputer") ||
    path.startsWith("/library");
  const hideFooter = path === "/" || isWorkspace || path.startsWith("/explore");

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--fg)]">
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-xl">
          <div className="flex h-14 items-center gap-5 px-3 sm:px-5 lg:h-16 lg:px-7">
            <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${site.name} home`}>
              <span className="grid h-8 w-8 place-items-center rounded-[0.65rem] bg-[var(--mint)] text-xs font-black text-black lg:h-9 lg:w-9">
                P
              </span>
              <span className="hidden text-base font-black tracking-[-0.03em] sm:inline">
                {site.name}
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
              {PRIMARY_NAV.map((item) => {
                const active = isActive(path, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-[var(--fg-muted)] hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="hidden lg:block"><StatusBadge /></div>
              <CreditsBadge />
              <Link href="/pricing" className="hidden text-xs font-semibold text-[var(--fg-muted)] hover:text-white sm:block">
                Pricing
              </Link>
              <Link href="/profile" className="grid h-8 w-8 place-items-center rounded-full border border-[var(--border)] bg-white/[0.04] text-xs text-[var(--fg-muted)] hover:text-white" aria-label="Profile">
                ○
              </Link>
              <Link href="/create" className="btn btn-primary !px-4 !py-2 text-xs">
                Create
              </Link>
            </div>
          </div>
        </header>

        <div className="hidden sm:block"><OnboardingBanner /></div>
        <CommandPalette />
        <main className="min-w-0 flex-1 flex-col pb-16 md:pb-0">{children}</main>
        {!hideFooter && <Footer />}

        <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-soft)_94%,transparent)] pb-[max(0.35rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden" aria-label="Mobile primary">
          {PRIMARY_NAV.map((item) => {
            const active = isActive(path, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold ${
                  active ? "text-[var(--mint)]" : "text-[var(--fg-dim)]"
                }`}
              >
                <span className="text-sm" aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </ToastProvider>
  );
}
