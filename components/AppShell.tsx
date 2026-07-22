"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { CreditsBadge } from "@/components/CreditsBadge";
import { CommandPalette } from "@/components/CommandPalette";
import { ToastProvider } from "@/components/Toast";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

/**
 * Higgsfield-class app chrome:
 * - thin icon rail (always)
 * - full-bleed main (no marketing top bar on home)
 * - mobile: Home · Community · Generate · Library · Profile
 */
const SIDE_NAV = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/create", label: "Generate", icon: "✦" },
  { href: "/community", label: "Community", icon: "◉" },
  { href: "/effects", label: "Presets", icon: "▶" },
  { href: "/explore", label: "Explore", icon: "✧" },
  { href: "/library", label: "Library", icon: "▢" },
  { href: "/supercomputer", label: "Batch", icon: "⚡" },
  { href: "/image", label: "Image", icon: "▣" },
  { href: "/pricing", label: "Pricing", icon: "$" },
  { href: "/profile", label: "Profile", icon: "○" },
] as const;

const MOBILE_NAV = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/community", label: "Community", icon: "◉" },
  { href: "/create", label: "Generate", icon: "✦", primary: true },
  { href: "/library", label: "Library", icon: "▢" },
  { href: "/profile", label: "Profile", icon: "○" },
];

function isActive(path: string, href: string) {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(href + "/");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/";
  const isHome = path === "/";
  const isTool =
    path.startsWith("/create") || path.startsWith("/supercomputer");
  const hideFooter = isHome || isTool || path.startsWith("/explore");

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-black text-white">
        {/* HF-style thin left rail — icons only */}
        <aside className="sticky top-0 z-50 hidden h-screen w-[64px] shrink-0 flex-col items-center border-r border-white/[0.06] bg-[#0a0a0c] py-3 lg:flex">
          <Link
            href="/"
            className="mb-5 grid h-9 w-9 place-items-center rounded-xl bg-[var(--mint)] text-sm font-black text-black"
            title={site.name}
          >
            P
          </Link>
          <nav className="flex flex-1 flex-col items-center gap-1 overflow-y-auto">
            {SIDE_NAV.map((item) => {
              const active = isActive(path, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-xl text-base transition",
                    active
                      ? "bg-white/10 text-[var(--mint)]"
                      : "text-white/45 hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  <span aria-hidden>{item.icon}</span>
                  <span className="sr-only">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-2 flex flex-col items-center gap-2 px-1">
            <CreditsBadge compact />
            <Link
              href="/create"
              className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--mint)] text-sm font-black text-black"
              title="Generate"
            >
              ✦
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-black">
          {/* Mobile top — minimal, HF-like */}
          <header
            className={cn(
              "sticky top-0 z-40 flex h-12 items-center justify-between border-b border-white/[0.06] bg-black/80 px-3 backdrop-blur-md lg:hidden",
              isHome && "border-transparent bg-black/40"
            )}
          >
            <Link href="/" className="flex items-center gap-2 text-sm font-bold">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--mint)] text-xs font-black text-black">
                P
              </span>
              {site.name}
            </Link>
            <div className="flex items-center gap-2">
              <CreditsBadge compact />
              <Link
                href="/create"
                className="rounded-full bg-[var(--mint)] px-3 py-1.5 text-[11px] font-black text-black"
              >
                Generate
              </Link>
            </div>
          </header>

          {/* Desktop: no marketing top bar — pure content like HF */}
          {!isHome && (
            <header className="sticky top-0 z-40 hidden h-12 items-center justify-end gap-3 border-b border-white/[0.06] bg-black/70 px-4 backdrop-blur-md lg:flex">
              <CreditsBadge />
              <Link
                href="/pricing"
                className="text-xs font-semibold text-white/60 hover:text-white"
              >
                Pricing
              </Link>
              <Link
                href="/create"
                className="rounded-full bg-[var(--mint)] px-4 py-1.5 text-xs font-black text-black"
              >
                Generate
              </Link>
            </header>
          )}

          <CommandPalette />
          <div className="flex-1 bg-black">{children}</div>
          {!hideFooter && <Footer />}

          {/* HF mobile dock */}
          <nav className="sticky bottom-0 z-40 flex items-end border-t border-white/[0.06] bg-[#0a0a0c]/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
            {MOBILE_NAV.map((item) => {
              const active = isActive(path, item.href);
              if (item.primary) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-1 flex-col items-center gap-0.5 py-1.5"
                  >
                    <span
                      className={cn(
                        "grid h-12 w-12 place-items-center rounded-2xl bg-[var(--mint)] text-lg font-black text-black shadow-[0_0_28px_rgba(200,255,61,0.4)]",
                        active && "ring-2 ring-white/50"
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="text-[9px] font-bold text-[var(--mint)]">
                      {item.label}
                    </span>
                  </Link>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[9px] font-semibold",
                    active ? "text-[var(--mint)]" : "text-white/45"
                  )}
                >
                  <span className="text-base">{item.icon}</span>
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
