import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOfficialProject } from "@/lib/videoFeed";
import { getPreset } from "@/lib/presets";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getOfficialProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} · Official example`,
    description: project.result,
    robots: { index: true, follow: true },
  };
}

export default async function OfficialProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getOfficialProject(slug);
  if (!project) notFound();

  const preset = getPreset(project.recipeSlug);

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white sm:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#c8ff3d]">
            Inside this recipe · Official example
          </p>
          <h1 className="font-display mt-2 text-3xl font-black uppercase tracking-tight">
            {project.title}
          </h1>
          <p className="mt-2 text-sm text-white/55">{project.result}</p>

          <div className="mt-6 overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10">
            <video
              className="aspect-[9/14] w-full object-cover"
              poster={project.demo.poster}
              controls
              playsInline
              muted
              loop
              preload="metadata"
            >
              <source src={project.demo.webm} type="video/webm" />
              <source src={project.demo.mp4} type="video/mp4" />
            </video>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/40">
              Input still
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.demo.poster}
              alt={`Input for ${project.title}`}
              className="mt-2 max-h-64 w-full rounded-xl object-cover ring-1 ring-white/10"
            />
          </div>

          <dl className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-white/40">Job</dt>
              <dd className="font-semibold">{project.eyebrow}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/40">Recipe</dt>
              <dd className="font-semibold">{project.recipeSlug}</dd>
            </div>
            {preset && (
              <>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/40">Duration</dt>
                  <dd>{preset.duration}s</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/40">Aspect</dt>
                  <dd>{preset.aspectRatio}</dd>
                </div>
              </>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-white/40">Provenance</dt>
              <dd className="text-[#c8ff3d]">Cached official example</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/40">Live cost (if live)</dt>
              <dd>{CREDITS_PER_VIDEO} credits / job</dd>
            </div>
            <div className="pt-2 text-xs leading-relaxed text-white/45">
              Prompt is a registered recipe template. Exact output is not
              guaranteed. Live generation uses your photo; this page shows a
              cached Lab demo.
            </div>
          </dl>

          <div className="flex flex-wrap gap-3">
            <Link
              href={project.remakeHref}
              className="inline-flex rounded-full bg-[#c8ff3d] px-6 py-3 text-sm font-black text-black"
            >
              Use this recipe
            </Link>
            <Link
              href={project.effectsHref}
              className="inline-flex rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white"
            >
              Effect page
            </Link>
            <Link
              href="/"
              className="inline-flex px-3 py-3 text-sm text-white/50 hover:text-white"
            >
              ← Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
