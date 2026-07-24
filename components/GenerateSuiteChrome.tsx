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
  {
    id: "flow",
    label: "Flow",
    href: "/flow",
    blurb: "Matrix",
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
      return (path === "/create" || path === "/generate") && !sellerMode;
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
    if (id === "flow") {
      return path === "/flow";
    }
    return false;
  }

  return (
    <div className="suite-chrome px-4 py-3">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1
              className={cn(
                "font-display font-black tracking-tight text-white",
                compact ? "text-base" : "text-lg sm:text-xl"
              )}
            >
              Generate
            </h1>
            <span className="rounded-full border border-[var(--mint)]/40 bg-[var(--mint)]/12 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[var(--mint)] shadow-[0_0_20px_rgba(200,255,61,0.12)]">
              Toy studio
            </span>
            <span className="hidden rounded-full border border-white/10 px-2 py-0.5 text-[9px] font-semibold text-white/40 sm:inline">
              Seedance live
            </span>
          </div>
          {!compact && (
            <p className="mt-0.5 text-[11px] text-white/45 sm:text-xs">
              {site.suiteLine} — craft-grade toy clips, not a model zoo
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
                  "shrink-0 rounded-xl border px-3 py-1.5 transition duration-200",
                  active
                    ? "border-[var(--mint)] bg-[var(--mint)]/15 text-[var(--mint)] shadow-[0_0_24px_rgba(200,255,61,0.12)]"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
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
