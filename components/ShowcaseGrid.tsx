"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SHOWCASE_CATEGORIES,
  type ShowcaseCategory,
  type ShowcaseProject,
} from "@/lib/showcase";

function ProjectCard({
  project,
  index,
  register,
  onOpen,
  onActivate,
}: {
  project: ShowcaseProject;
  index: number;
  register: (id: string, node: HTMLVideoElement | null) => void;
  onOpen: () => void;
  onActivate: () => void;
}) {
  const portrait = project.aspectRatio === "9:16";
  const square = project.aspectRatio === "1:1";
  return (
    <article
      className="video-tile group mb-3 break-inside-avoid"
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      <button type="button" className="block w-full text-left" onClick={onOpen}>
        <div className={`relative ${portrait ? "aspect-[9/14]" : square ? "aspect-square" : "aspect-video"}`}>
          <video
            ref={(node) => register(project.id, node)}
            poster={project.output.poster}
            muted
            loop
            playsInline
            preload={index === 0 ? "metadata" : "none"}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={project.output.webm} type="video/webm" />
            <source src={project.output.mp4} type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <span className="absolute left-2 top-2 rounded-full border border-white/15 bg-black/60 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/80 backdrop-blur">
            {project.proof === "verified" ? "Verified output" : "PIKBO Lab"}
          </span>
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/55">
              {project.presetName} · {project.aspectRatio}
            </p>
            <h3 className="mt-1 text-sm font-bold text-white sm:text-base">{project.title}</h3>
            <p className="mt-1 text-[11px] text-white/60">{project.channel}</p>
            <p className="mt-2 text-[11px] font-semibold text-[var(--mint)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              Inside this project →
            </p>
          </div>
        </div>
      </button>
    </article>
  );
}

function ProjectDialog({ project, onClose }: { project: ShowcaseProject; onClose: () => void }) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] grid place-items-end bg-black/75 p-0 backdrop-blur-sm sm:place-items-center sm:p-6" role="presentation" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-t-3xl border border-[var(--border)] bg-[var(--bg-soft)] shadow-2xl sm:rounded-3xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 sm:px-6">
          <div>
            <p className="section-label">Inside this project</p>
            <h2 id="project-dialog-title" className="mt-1 text-lg font-bold">{project.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--fg-muted)] hover:text-white" aria-label="Close project">
            ×
          </button>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(290px,0.75fr)]">
          <div className="media-well grid min-h-[45vh] place-items-center border-b border-[var(--border)] p-3 lg:border-b-0 lg:border-r lg:p-6">
            <video controls autoPlay muted loop playsInline poster={project.output.poster} className="max-h-[68vh] w-full rounded-2xl object-contain">
              <source src={project.output.webm} type="video/webm" />
              <source src={project.output.mp4} type="video/mp4" />
            </video>
          </div>

          <aside className="space-y-5 p-5 sm:p-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-dim)]">Owned-toy input</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.inputAssets[0].url} alt={`${project.character} input reference`} className="mt-3 aspect-video w-full rounded-xl object-cover" />
            </div>

            <dl className="grid grid-cols-2 gap-3 text-xs">
              {[
                ["Effect", project.presetName],
                ["Model", project.model],
                ["Format", `${project.duration}s · ${project.aspectRatio}`],
                ["Output", project.resolution],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                  <dt className="text-[10px] uppercase tracking-wider text-[var(--fg-dim)]">{label}</dt>
                  <dd className="mt-1 font-semibold text-[var(--fg)]">{value}</dd>
                </div>
              ))}
            </dl>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-dim)]">Prompt summary</p>
              <p className="mt-2 text-sm leading-6 text-[var(--fg-muted)]">{project.promptSummary}</p>
            </div>

            <div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-3 text-xs leading-5 text-amber-100/75">
              {project.proof === "verified"
                ? `Verified provider task · ${project.providerTaskId}`
                : "Cached PIKBO Lab prototype. No provider task is claimed for this clip."}
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href={`/create?effect=${project.presetId}&source=project-${project.slug}`} className="btn btn-primary flex-1 px-5 py-3 text-xs">
                Use this recipe
              </Link>
              <Link href={`/projects/${project.slug}`} className="btn btn-ghost px-5 py-3 text-xs">
                Full details
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export function ShowcaseGrid({
  projects,
  filters = false,
  limit,
}: {
  projects: ShowcaseProject[];
  filters?: boolean;
  limit?: number;
}) {
  const [category, setCategory] = useState<"all" | ShowcaseCategory>("all");
  const [openProject, setOpenProject] = useState<ShowcaseProject | null>(null);
  const videos = useRef(new Map<string, HTMLVideoElement>());
  const ratios = useRef(new Map<string, number>());

  const visibleProjects = useMemo(() => {
    const filtered = category === "all" ? projects : projects.filter((item) => item.category === category);
    return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
  }, [category, limit, projects]);

  const activate = useCallback((id: string) => {
    videos.current.forEach((video, key) => {
      if (key === id) video.play().catch(() => undefined);
      else video.pause();
    });
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => ratios.current.set((entry.target as HTMLElement).dataset.projectId ?? "", entry.intersectionRatio));
        const winner = [...ratios.current.entries()].sort((a, b) => b[1] - a[1])[0];
        if (winner && winner[1] >= 0.58) activate(winner[0]);
        else videos.current.forEach((video) => video.pause());
      },
      { threshold: [0, 0.35, 0.58, 0.8] }
    );
    videos.current.forEach((video, id) => {
      video.dataset.projectId = id;
      observer.observe(video);
    });
    return () => observer.disconnect();
  }, [activate, visibleProjects]);

  return (
    <>
      {filters && (
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1" aria-label="Project categories">
          {SHOWCASE_CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={`chip shrink-0 ${category === item.id ? "!border-[var(--mint)] !text-[var(--mint)]" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      <div className="columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4">
        {visibleProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            register={(id, node) => {
              if (node) videos.current.set(id, node);
              else videos.current.delete(id);
            }}
            onActivate={() => activate(project.id)}
            onOpen={() => setOpenProject(project)}
          />
        ))}
      </div>
      {openProject && <ProjectDialog project={openProject} onClose={() => setOpenProject(null)} />}
    </>
  );
}
