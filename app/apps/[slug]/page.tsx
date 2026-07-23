import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { APPS } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return APPS.filter((a) => a.href.startsWith("/apps/")).map((a) => ({
    slug: a.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = APPS.find((a) => a.id === slug);
  return {
    title: app?.name ?? "App",
    robots: { index: false, follow: false },
  };
}

export default async function StubAppPage({ params }: Props) {
  const { slug } = await params;
  const app = APPS.find((a) => a.id === slug);
  if (!app) notFound();

  return (
    <div className="px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-lg text-center">
        <span className="text-5xl">{app.emoji}</span>
        <h1 className="mt-4 text-3xl font-bold">{app.name}</h1>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">{app.blurb}</p>
        <p className="mt-4 text-xs text-[var(--fg-dim)]">
          Catalog stub for suite parity. Core live path is Image → Video
          (Seedance).
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/create" className="btn btn-primary text-sm">
            Open Generate
          </Link>
          <Link href="/apps" className="btn btn-ghost text-sm">
            All apps
          </Link>
        </div>
      </div>
    </div>
  );
}
