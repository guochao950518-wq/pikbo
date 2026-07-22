"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Sticky mobile CTA when not already on Generate */
export function MobileGenerateBar() {
  const path = usePathname() || "/";
  // Hide when a full tool surface is already on-screen
  if (
    path.startsWith("/create") ||
    path.startsWith("/supercomputer") ||
    path.startsWith("/effects/") ||
    path.startsWith("/for/") ||
    path.startsWith("/toys/")
  ) {
    return null;
  }
  // The home hero already owns the primary CTA. Keep this extra bar only on
  // browse walls, where users may be several cards away from Generate.
  const showBar =
    path.startsWith("/explore") ||
    path.startsWith("/community") ||
    path === "/effects";
  if (!showBar) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[4.75rem] z-30 flex justify-center gap-2 px-4 lg:hidden">
      <Link
        href="/create"
        className="pointer-events-auto btn btn-primary px-5 py-2.5 text-xs shadow-[0_0_30px_rgba(200,255,61,0.35)]"
      >
        Use free trial
      </Link>
      <Link
        href="/effects"
        className="pointer-events-auto rounded-full border border-white/15 bg-black/70 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur"
      >
        Browse looks
      </Link>
    </div>
  );
}
