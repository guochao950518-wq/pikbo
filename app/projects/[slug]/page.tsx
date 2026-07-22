import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SHOWCASE_PROJECTS, getShowcaseProject } from "@/lib/showcase";

export function generateStaticParams() {
  return SHOWCASE_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getShowcaseProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} — PIKBO Lab project`,
    description: `${project.result} Inspect the owned-toy input, effect, format, and proof status.`,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getShowcaseProject(slug);
  if (!project) notFound();

  return (
    <div className="pb-24">
      <header className="border-b border-[var(--border)]">
        <div className="container-x py-4">
          <Link href="/explore" className="text-xs font-semibold text-[var(--fg-muted)] hover:text-white">← Explore</Link>
        </div>
      </header>

      <main className="container-x py-6 sm:py-10">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-label">Inside this project</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.035em] sm:text-5xl">{project.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--fg-muted)]">{project.result}</p>
          </div>
          <Link href={`/create?effect=${project.presetId}&source=project-${project.slug}`} className="btn btn-primary self-start px-6 py-3 text-sm sm:self-auto">Use this recipe</Link>
        </div>

        <div className="grid overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.75fr)]">
          <div className="media-well grid min-h-[54vh] place-items-center border-b border-[var(--border)] p-3 lg:border-b-0 lg:border-r lg:p-8">
            <video controls autoPlay muted loop playsInline poster={project.output.poster} className="max-h-[72vh] w-full rounded-2xl object-contain">
              <source src={project.output.webm} type="video/webm" />
              <source src={project.output.mp4} type="video/mp4" />
            </video>
          </div>

          <aside className="space-y-5 p-5 sm:p-7">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-dim)]">Owned-toy input</p>
                <span className="chip">Front</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.inputAssets[0].url} alt={`${project.character} input reference`} className="mt-3 aspect-video w-full rounded-2xl object-cover" />
            </div>

            <dl className="grid grid-cols-2 gap-3 text-xs">
              {[
                ["Effect", project.presetName],
                ["Model", project.model],
                ["Format", `${project.duration}s · ${project.aspectRatio}`],
                ["Output", project.resolution],
                ["Channel", project.channel],
                ["Proof", project.proof === "verified" ? "Provider verified" : "Lab prototype"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-3">
                  <dt className="text-[9px] uppercase tracking-wider text-[var(--fg-dim)]">{label}</dt>
                  <dd className="mt-1 font-semibold">{value}</dd>
                </div>
              ))}
            </dl>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-dim)]">Prompt summary</p>
              <p className="mt-2 text-sm leading-6 text-[var(--fg-muted)]">{project.promptSummary}</p>
            </div>

            <div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-3 text-xs leading-5 text-amber-100/75">
              {project.proof === "verified" ? `Provider task ${project.providerTaskId}` : "Cached PIKBO Lab prototype. No provider task or customer result is claimed."}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
