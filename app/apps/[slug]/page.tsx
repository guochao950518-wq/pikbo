import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { APPS } from "@/lib/catalog";
import { getWorkflow, WORKFLOWS } from "@/lib/workflows";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const fromApps = APPS.filter((a) => a.href.startsWith("/apps/")).map((a) => ({
    slug: a.id,
  }));
  const fromWorkflows = WORKFLOWS.map((w) => ({ slug: w.id }));
  const seen = new Set<string>();
  return [...fromWorkflows, ...fromApps].filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workflow = getWorkflow(slug);
  const app = APPS.find((a) => a.id === slug);
  const title = workflow?.label ?? app?.name ?? "App";
  return {
    title: `${title} · Pikbo`,
    robots: workflow?.live
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export default async function AppDetailPage({ params }: Props) {
  const { slug } = await params;
  const workflow = getWorkflow(slug);
  const app = APPS.find((a) => a.id === slug);
  if (!workflow && !app) notFound();

  const emoji = workflow?.emoji ?? app?.emoji ?? "🧸";
  const name = workflow?.label ?? app?.name ?? "App";
  const blurb = workflow?.blurb ?? app?.blurb ?? "";
  const href = workflow?.href ?? app?.href ?? "/create";
  const live = workflow?.live ?? app?.live ?? false;

  return (
    <div className="px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-lg text-center">
        <span className="text-5xl">{emoji}</span>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <h1 className="text-3xl font-bold">{name}</h1>
          {live ? (
            <span className="rounded-full bg-[var(--mint)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--mint)]">
              LIVE
            </span>
          ) : (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-[var(--fg-dim)]">
              SOON
            </span>
          )}
          {workflow?.badge && (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/55">
              {workflow.badge}
            </span>
          )}
        </div>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">{blurb}</p>
        {workflow && (
          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-xs text-[var(--fg-muted)]">
            <li className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
              <span className="font-semibold text-white/80">Input · </span>
              One photo of a toy you own
            </li>
            <li className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
              <span className="font-semibold text-white/80">Engine · </span>
              Seedance image-to-video (same as Generate)
            </li>
            {workflow.effect && (
              <li className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                <span className="font-semibold text-white/80">Recipe · </span>
                {workflow.effect}
                {workflow.aspectRatio ? ` · ${workflow.aspectRatio}` : ""}
              </li>
            )}
            <li className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
              <span className="font-semibold text-white/80">Output · </span>
              Short product clip for listing or social
            </li>
          </ul>
        )}
        {!workflow && (
          <p className="mt-4 text-xs text-[var(--fg-dim)]">
            Catalog entry for suite parity. Core live path is Photo → Clip
            (Seedance).
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={href} className="btn btn-primary text-sm">
            {live ? "Launch workflow" : "Open Generate"}
          </Link>
          <Link href="/apps" className="btn btn-ghost text-sm">
            All apps
          </Link>
        </div>
      </div>
    </div>
  );
}
