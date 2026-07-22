import type { Metadata } from "next";
import Link from "next/link";
import { ShowcaseGrid } from "@/components/ShowcaseGrid";
import { SHOWCASE_PROJECTS } from "@/lib/showcase";

export const metadata: Metadata = {
  title: "Explore toy video projects",
  description: "Open PIKBO Lab toy-video projects, inspect their inputs and recipes, then reuse an effect in Studio.",
};

export default function ExplorePage() {
  return (
    <div className="pb-24">
      <header className="sticky top-14 z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] backdrop-blur-xl lg:top-16">
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <div>
            <p className="section-label">PIKBO Lab</p>
            <h1 className="mt-1 text-lg font-black tracking-tight sm:text-xl">Explore toy video projects</h1>
          </div>
          <Link href="/create" className="btn btn-primary !px-4 !py-2 text-xs">Create</Link>
        </div>
      </header>

      <section className="container-x py-8 sm:py-12">
        <div className="mb-7 max-w-3xl">
          <span className="chip !border-amber-200/20 !text-amber-100/70">Official cached prototypes</span>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.035em] sm:text-5xl">See the motion. Open the recipe.</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--fg-muted)]">These are PIKBO-owned lab examples, not public user posts. Each card states whether it has provider proof.</p>
        </div>
        <ShowcaseGrid projects={SHOWCASE_PROJECTS} filters />
      </section>
    </div>
  );
}
