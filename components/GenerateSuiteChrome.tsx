"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * HF Generate–style suite chrome for the toy vertical.
 * Modes map to real Pikbo surfaces only (no fake Cinema tabs).
 */
const MODES = [
  {
    id: "generate",
    label: "Photo → Clip",
    href: "/create",
    blurb: "Workbench",
  },
  {
    id: "modules",
    label: "Modules",
    href: "/modules",
    blurb: "Job blocks",
  },
  {
    id: "seller",
    label: "Seller Pack",
    href: "/create?mode=seller-pack",
    blurb: "3 clips",
  },
  {
    id: "recipes",
    label: "Recipes",
    href: "/effects",
    blurb: "Preset wall",
  },
] as const;

export function GenerateSuiteChrome({
  compact,
}: {
  compact?: boolean;
}) {
  const path = usePathname() || "";
  const sp = useSearchParams();
  const sellerMode =
    sp?.get("mode") === "seller-pack" || sp?.get("mode") === "seller";

  function isActive(id: (typeof MODES)[number]["id"]) {
    if (id === "generate") {
      return (
        (path === "/create" || path === "/generate") && !sellerMode
      );
    }
    if (id === "seller") {
      return path === "/create" && sellerMode;
    }
    if (id === "modules") {
      return path === "/modules" || path === "/apps";
    }
    if (id === "recipes") {
      return path.startsWith("/effects");
    }
    return false;
  }

  return (
    <div className="border-b border-white/10 bg-[#08080c]/90 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1
              className={cn(
                "font-black tracking-tight text-white",
                compact ? "text-base" : "text-lg sm:text-xl"
              )}
            >
              Generate
            </h1>
            <span className="rounded-full border border-[var(--mint)]/35 bg-[var(--mint)]/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[var(--mint)]">
              Toy studio
            </span>
          </div>
          {!compact && (
            <p className="mt-0.5 text-[11px] text-white/45 sm:text-xs">
              {site.suiteLine} — designer-toy workbench (not a generic model zoo)
            </p>
          )}
        </div>
        <nav
          aria-label="Suite modes"
          className="flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none]"
        >
          {MODES.map((m) => {
            const active = isActive(m.id);
            return (
              <Link
                key={m.id}
                href={m.href}
                className={cn(
                  "shrink-0 rounded-xl border px-3 py-1.5 transition",
                  active
                    ? "border-[var(--mint)] bg-[var(--mint)]/15 text-[var(--mint)]"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white"
                )}
              >
                <span className="block text-[11px] font-bold leading-none">
                  {m.label}
                </span>
                <span className="mt-0.5 block text-[9px] opacity-60">
                  {m.blurb}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
