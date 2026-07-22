"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { CreditsBadge } from "@/components/CreditsBadge";
import { CommandPalette } from "@/components/CommandPalette";
import { ToastProvider } from "@/components/Toast";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

/** HF-style: thin left icons + full-bleed black content */
const SIDE = [
  { href: "/", icon: "⌂", label: "Home" },
  { href: "/create", icon: "✦", label: "Generate" },
  { href: "/community", icon: "◉", label: "Community" },
  { href: "/effects", icon: "▶", label: "Presets" },
  { href: "/explore", icon: "✧", label: "Explore" },
  { href: "/library", icon: "▢", label: "Library" },
  { href: "/supercomputer", icon: "⚡", label: "Batch" },
  { href: "/image", icon: "▣", label: "Image" },
  { href: "/pricing", icon: "$", label: "Pricing" },
  { href: "/profile", icon: "○", label: "Profile" },
] as const;

const MOBILE = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/community", label: "Community", icon: "◉" },
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
      <div className="flex min-h-screen bg-black text-white">
        <aside className="sticky top-0 z-50 hidden h-screen w-16 shrink-0 flex-col items-center border-r border-white/[0.07] bg-[#09090b] py-3 lg:flex">
          <Link
            href="/"
            className="mb-4 grid h-9 w-9 place-items-center rounded-xl bg-[#c8ff3d] text-sm font-black text-black"
            title={site.name}
          >
            P
          </Link>
          <nav className="flex flex-1 flex-col items-center gap-1">
            {SIDE.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-xl text-base transition",
                  active(path, item.href)
                    ? "bg-white/10 text-[#c8ff3d]"
                    : "text-white/40 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                {item.icon}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col items-center gap-2">
            <CreditsBadge compact />
            <Link
              href="/create"
              className="grid h-10 w-10 place-items-center rounded-xl bg-[#c8ff3d] text-sm font-black text-black"
            >
              ✦
            </Link>
          </div>
        </aside>

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

          {!home && (
            <header className="sticky top-0 z-40 hidden h-12 items-center justify-end gap-3 border-b border-white/[0.07] bg-black/70 px-4 backdrop-blur-md lg:flex">
              <CreditsBadge />
              <Link href="/pricing" className="text-xs font-semibold text-white/50 hover:text-white">
                Pricing
              </Link>
              <Link
                href="/create"
                className="rounded-full bg-[#c8ff3d] px-4 py-1.5 text-xs font-black text-black"
              >
                Generate
              </Link>
            </header>
          )}

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
