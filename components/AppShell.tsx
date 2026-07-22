"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { CreditsBadge } from "@/components/CreditsBadge";
import { CommandPalette } from "@/components/CommandPalette";
import { ToastProvider } from "@/components/Toast";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

/** Higgsfield-style: top horizontal text nav + full-bleed black content */
const TOP = [
  { href: "/", label: "Explore" },
  { href: "/image", label: "Image" },
  { href: "/create", label: "Video" },
  { href: "/cinema", label: "Cinema Studio" },
  { href: "/effects", label: "Presets" },
  { href: "/models", label: "Models" },
  { href: "/supercomputer", label: "Batch" },
  { href: "/community", label: "PIKBO Lab" },
  { href: "/explore", label: "Feed" },
  { href: "/library", label: "Library" },
] as const;

const MOBILE = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/community", label: "PIKBO Lab", icon: "◉" },
  { href: "/create", label: "Generate", icon: "✦", primary: true as const },
  { href: "/library", label: "Library", icon: "▢" },
  { href: "/profile", label: "Profile", icon: "○" },
];

function active(path: string, href: string) {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(href + "/");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/";
  const home = path === "/";
  const hideFooter =
    home ||
    path.startsWith("/create") ||
    path.startsWith("/supercomputer") ||
    path.startsWith("/explore") ||
    path.startsWith("/community");

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-black text-white">
        {/* Desktop top nav — Higgsfield style */}
        <header className="sticky top-0 z-50 hidden h-14 items-center gap-6 border-b border-white/[0.07] bg-black/80 px-5 backdrop-blur-md lg:flex">
          <Link href="/" className="flex shrink-0 items-center gap-2" title={site.name}>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#c8ff3d] text-sm font-black text-black">
              P
            </span>
            <span className="font-display text-lg font-bold tracking-tight">{site.name}</span>
          </Link>
          <nav className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TOP.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 whitespace-nowrap text-[13px] font-medium transition-colors",
                  active(path, item.href)
                    ? "text-[#c8ff3d]"
                    : "text-white/55 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <CreditsBadge />
            <Link
              href="/pricing"
              className="text-[13px] font-semibold text-white/70 hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/create"
              className="rounded-full bg-[#c8ff3d] px-4 py-1.5 text-[13px] font-black text-black transition-transform hover:-translate-y-0.5"
            >
              Generate
            </Link>
          </div>
        </header>

        <div className="flex min-w-0 flex-1 flex-col bg-black">
          <header
            className={cn(
              "sticky top-0 z-40 flex h-12 items-center justify-between px-3 lg:hidden",
              home
                ? "border-b border-transparent bg-black/30 backdrop-blur-md"
                : "border-b border-white/[0.07] bg-black/80 backdrop-blur-md"
            )}
          >
            <Link href="/" className="flex items-center gap-2 text-sm font-bold">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#c8ff3d] text-xs font-black text-black">
                P
              </span>
              {site.name}
            </Link>
            <div className="flex items-center gap-2">
              <CreditsBadge compact />
              <Link
                href="/create"
                className="rounded-full bg-[#c8ff3d] px-3 py-1.5 text-[11px] font-black text-black"
              >
                Generate
              </Link>
            </div>
          </header>

          <CommandPalette />
          <main className="flex-1 bg-black">{children}</main>
          {!hideFooter && <Footer />}

          <nav className="sticky bottom-0 z-40 flex items-end border-t border-white/[0.07] bg-[#09090b]/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
            {MOBILE.map((item) => {
              const on = active(path, item.href);
              if (item.primary) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-1 flex-col items-center gap-0.5 py-1.5"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#c8ff3d] text-lg font-black text-black shadow-[0_0_28px_rgba(200,255,61,0.45)]">
                      {item.icon}
                    </span>
                    <span className="text-[9px] font-bold text-[#c8ff3d]">{item.label}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[9px] font-semibold",
                    on ? "text-[#c8ff3d]" : "text-white/40"
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
