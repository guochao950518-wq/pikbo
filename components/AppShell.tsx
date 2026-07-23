"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { CreditsBadge } from "@/components/CreditsBadge";
import { Logo } from "@/components/Logo";
import { CommandPalette } from "@/components/CommandPalette";
import { ToastProvider } from "@/components/Toast";
import { Footer } from "@/components/Footer";
import { LanguageProvider, useI18n } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

/** Higgsfield-style: top horizontal text nav + full-bleed black content */
const TOP = [
  { href: "/", key: "nav.explore" },
  { href: "/image", key: "nav.image" },
  { href: "/create", key: "nav.video" },
  { href: "/cinema", key: "nav.cinema" },
  { href: "/effects", key: "nav.presets" },
  { href: "/models", key: "nav.models" },
  { href: "/supercomputer", key: "nav.batch" },
  { href: "/community", key: "nav.lab" },
  { href: "/explore", key: "nav.feed" },
  { href: "/library", key: "nav.library" },
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
  return (
    <LanguageProvider>
      <ToastProvider>
        <AppShellInner>{children}</AppShellInner>
      </ToastProvider>
    </LanguageProvider>
  );
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const path = usePathname() || "/";
  const home = path === "/";
  const hideFooter =
    home ||
    path.startsWith("/create") ||
    path.startsWith("/supercomputer") ||
    path.startsWith("/explore") ||
    path.startsWith("/community");

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Desktop top nav — Higgsfield style */}
      <header className="sticky top-0 z-50 hidden h-14 items-center gap-6 border-b border-white/[0.07] bg-black/80 px-5 backdrop-blur-md lg:flex">
        <Link href="/" className="flex shrink-0 items-center" title={site.name}>
          <Logo size={30} />
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
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <LanguageSwitcher />
          <CreditsBadge />
          <Link
            href="/pricing"
            className="text-[13px] font-semibold text-white/70 hover:text-white"
          >
            {t("cta.pricing")}
          </Link>
          <Link
            href="/create"
            className="rounded-full bg-[#c8ff3d] px-4 py-1.5 text-[13px] font-black text-black transition-transform hover:-translate-y-0.5"
          >
            {t("cta.generate")}
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
          <Link href="/" className="flex items-center">
            <Logo size={26} wordClassName="text-base" />
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <CreditsBadge compact />
            <Link
              href="/create"
              className="rounded-full bg-[#c8ff3d] px-3 py-1.5 text-[11px] font-black text-black"
            >
              {t("cta.generate")}
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
                  <span className="text-[9px] font-bold text-[#c8ff3d]">
                    {t("cta.generate")}
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
  );
}
