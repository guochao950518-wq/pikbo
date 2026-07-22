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
  return (
    <>
      <div aria-hidden="true" className="h-20 lg:hidden" />
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 flex justify-center px-4 lg:hidden">
        <Link
          href="/create"
          className="pointer-events-auto btn btn-primary px-7 py-3 text-sm shadow-[0_0_30px_rgba(200,255,61,0.35)]"
        >
          Generate a clip
        </Link>
      </div>
    </>
  );
}
