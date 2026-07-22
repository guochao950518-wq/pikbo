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
import { Footer } from "@/components/Footer";

/** Retail-style primary nav (POP MART–like top bar, not AI-suite chrome). */
const NAV_PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/create", label: "Create" },
  { href: "/effects", label: "Presets" },
  { href: "/explore", label: "Explore" },
  { href: "/library", label: "Library" },
  { href: "/pricing", label: "Pricing" },
];

const NAV_MORE = [
  { href: "/image", label: "Stills" },
  { href: "/cinema", label: "Cinema" },
  { href: "/supercomputer", label: "Batch" },
  { href: "/guides", label: "Guides" },
  { href: "/apps", label: "Apps" },
  { href: "/models", label: "Models" },
  { href: "/community", label: "Community" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

const MOBILE_TABS = [
  { href: "/", label: "Home" },
  { href: "/create", label: "Create" },
  { href: "/effects", label: "Presets" },
  { href: "/library", label: "Library" },
  { href: "/pricing", label: "Plans" },
];

function isActive(path: string, href: string) {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(href + "/");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/";
  const isStudio =
    path.startsWith("/create") || path.startsWith("/supercomputer");

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--fg)]">
        {/* Top retail header */}
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-soft)_92%,transparent)] backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
            <div className="flex min-w-0 items-center gap-6 lg:gap-10">
              <Link href="/" className="group flex shrink-0 items-center gap-2.5">
                <span
                  className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-black tracking-tight text-white shadow-md sm:h-9 sm:w-9"
                  style={{ background: "var(--grad)" }}
                >
                  P
                </span>
                <span
                  className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight sm:text-xl"
                >
                  {site.name}
                </span>
              </Link>

              <nav className="hidden items-center gap-0.5 md:flex">
                {NAV_PRIMARY.map((item) => {
                  const active = isActive(path, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                        active
                          ? "bg-[var(--fg)] text-white"
                          : "text-[var(--fg-muted)] hover:bg-black/[0.04] hover:text-[var(--fg)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <details className="relative">
                  <summary className="cursor-pointer list-none rounded-full px-3 py-1.5 text-[13px] font-medium text-[var(--fg-muted)] hover:bg-black/[0.04] hover:text-[var(--fg)] [&::-webkit-details-marker]:hidden">
                    More
                  </summary>
                  <div className="absolute left-0 top-full z-50 mt-2 min-w-[160px] rounded-2xl border border-[var(--border)] bg-white p-1.5 shadow-[var(--shadow-lg)]">
                    {NAV_MORE.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-xl px-3 py-2 text-[13px] text-[var(--fg-muted)] hover:bg-[var(--bg)] hover:text-[var(--fg)]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </details>
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden lg:block">
                <StatusBadge />
              </div>
              <CreditsBadge />
              <Link
                href="/create"
                className="btn btn-primary !px-4 !py-2 text-xs sm:text-sm"
              >
                Create
              </Link>
            </div>
          </div>
        </header>

        <OnboardingBanner />
        <CommandPalette />

        <main className="flex-1">{children}</main>

        {!isStudio && <Footer />}
        <MobileGenerateBar />

        {/* Mobile bottom tabs — minimal retail */}
        <nav className="sticky bottom-0 z-40 flex border-t border-[var(--border)] bg-white/95 backdrop-blur-md md:hidden">
          {MOBILE_TABS.map((item) => {
            const active = isActive(path, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold tracking-wide ${
                  active ? "text-[var(--brand)]" : "text-[var(--fg-dim)]"
                }`}
              >
                <span
                  className={`h-1 w-1 rounded-full ${
                    active ? "bg-[var(--brand)]" : "bg-transparent"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </ToastProvider>
  );
}
