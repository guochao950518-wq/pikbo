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
    <div className="pointer-events-none fixed inset-x-0 bottom-16 z-30 flex justify-center px-4 md:hidden">
      <Link
        href="/create"
        className="pointer-events-auto btn btn-primary px-7 py-3 text-sm shadow-[var(--shadow-lg)]"
      >
        Create a clip
      </Link>
    </div>
  );
}
