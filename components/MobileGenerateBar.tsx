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
    <div className="pointer-events-none fixed inset-x-0 bottom-14 z-30 flex justify-center px-4 lg:hidden">
      <Link
        href="/create"
        className="pointer-events-auto btn btn-primary shadow-xl shadow-pink-500/20 px-6 py-3 text-sm"
      >
        🧸 Animate my toy
      </Link>
    </div>
  );
}
