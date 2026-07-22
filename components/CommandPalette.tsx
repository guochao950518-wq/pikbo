"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PRESETS } from "@/lib/presets";

/** Critical path first — first-principles command palette */
const LINKS = [
  { href: "/", label: "Home" },
  { href: "/create", label: "Generate" },
  { href: "/effects", label: "Toy presets" },
  { href: "/library", label: "Library" },
  { href: "/pricing", label: "Pricing" },
  { href: "/profile", label: "Profile" },
  { href: "/image", label: "Still studio" },
  { href: "/supercomputer", label: "Batch agent" },
  { href: "/guides", label: "Guides" },
  { href: "/for/etsy-listing-videos", label: "For Etsy sellers" },
  { href: "/for/tiktok-shop-product-videos", label: "For TikTok Shop" },
  { href: "/explore", label: "Explore" },
  { href: "/community", label: "PIKBO Lab" },
  { href: "/cinema", label: "Cinema Studio" },
  { href: "/apps", label: "Apps" },
  { href: "/models", label: "Models" },
  { href: "/settings", label: "Settings" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQ("");
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    const pages = LINKS.filter((l) =>
      !query ? true : l.label.toLowerCase().includes(query)
    ).map((l) => ({ ...l, kind: "page" as const }));
    const presets = PRESETS.filter(
      (p) =>
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query)
    )
      .slice(0, 8)
      .map((p) => ({
        href: `/effects/${p.slug}`,
        label: `${p.emoji} ${p.name}`,
        kind: "preset" as const,
      }));
    return [...pages, ...presets];
  }, [q]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="card w-full max-w-lg overflow-hidden p-0 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Jump to page or preset… (⌘K)"
          className="w-full border-b border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && items[0]) {
              router.push(items[0].href);
              setOpen(false);
            }
          }}
        />
        <ul className="max-h-72 overflow-y-auto py-2">
          {items.map((item) => (
            <li key={item.href + item.label}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-2 text-sm hover:bg-[var(--bg-soft)]"
              >
                <span>{item.label}</span>
                <span className="text-[10px] uppercase text-[var(--fg-dim)]">
                  {item.kind}
                </span>
              </Link>
            </li>
          ))}
          {items.length === 0 && (
            <li className="px-4 py-6 text-center text-xs text-[var(--fg-dim)]">
              No matches
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
