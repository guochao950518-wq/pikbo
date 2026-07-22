import Link from "next/link";
import { HeroVideoBanner } from "@/components/HeroVideoBanner";
import { ShowcaseGrid } from "@/components/ShowcaseGrid";
import { PresetPreviewCard } from "@/components/PresetPreviewCard";
import { SHOWCASE_PROJECTS } from "@/lib/showcase";
import { PRESETS } from "@/lib/presets";

export default function Home() {
  return (
    <div className="pb-20">
      <HeroVideoBanner />

      <section className="border-b border-[var(--border)] bg-[var(--bg-soft)] py-4">
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 sm:px-7">
          {SHOWCASE_PROJECTS.slice(0, 5).map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group relative aspect-video w-[72vw] max-w-[330px] shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-black sm:w-[310px]"
            >
              <video muted loop playsInline preload="none" poster={project.output.poster} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]">
                <source src={project.output.webm} type="video/webm" />
                <source src={project.output.mp4} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/50">0{index + 1} · {project.presetName}</p>
                <h2 className="mt-1 text-sm font-bold text-white">{project.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x py-14 sm:py-20">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-label">Pikbo Lab · Explore inside every project</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.035em] sm:text-5xl">Watch the output. Inspect the recipe.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--fg-muted)]">Every visible project opens its owned-toy input, effect, format, prompt summary, and an honest proof label.</p>
          </div>
          <Link href="/explore" className="btn btn-ghost self-start px-5 py-2.5 text-xs sm:self-auto">Explore all →</Link>
        </div>
        <ShowcaseGrid projects={SHOWCASE_PROJECTS} />
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--bg-soft)] py-14 sm:py-20">
        <div className="container-x">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="section-label">Viral toy presets</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] sm:text-5xl">Pick a motion recipe.</h2>
              <p className="mt-3 text-sm text-[var(--fg-muted)]">Lab clips play. Unverified ideas stay clearly marked as concept recipes.</p>
            </div>
            <Link href="/effects" className="hidden text-xs font-bold text-[var(--mint)] sm:block">View all {PRESETS.length} →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {PRESETS.slice(0, 12).map((preset) => <PresetPreviewCard key={preset.slug} preset={preset} />)}
          </div>
          <Link href="/effects" className="btn btn-ghost mt-6 w-full py-3 text-xs sm:hidden">View all effects</Link>
        </div>
      </section>

      <section className="container-x py-16 sm:py-24">
        <div className="grid gap-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-10 lg:grid-cols-[1fr_1.25fr] lg:items-end">
          <div>
            <p className="section-label">One owned SKU</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] sm:text-5xl">Upload. Direct. Compare. Ship.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["01", "Add the toy", "Front photo required. Extra references are saved honestly."],
              ["02", "Pick the job", "Listing spin, unboxing, story scene, or shop hook."],
              ["03", "Keep the best", "Compare versions, retry failures, then build a SKU campaign."],
            ].map(([number, title, copy]) => (
              <div key={number} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                <span className="text-xs font-black text-[var(--mint)]">{number}</span>
                <h3 className="mt-5 text-sm font-bold">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[var(--fg-muted)]">{copy}</p>
              </div>
            ))}
          </div>
          <div className="lg:col-start-2">
            <Link href="/create" className="btn btn-primary px-7 py-3 text-sm">Open Toy Video Studio</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
