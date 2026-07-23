import type { Metadata } from "next";
import { CreateStudio } from "@/components/CreateStudio";
import { CreateSeoFooter } from "@/components/CreateSeoFooter";
import { getPreset } from "@/lib/presets";
import { site } from "@/lib/site";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ effect?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const preset = sp.effect ? getPreset(sp.effect) : undefined;
  if (preset) {
    return {
      title: { absolute: `Generate · ${preset.name} | ${site.name}` },
      description: preset.seoDescription,
      alternates: { canonical: `/effects/${preset.slug}` },
      robots: { index: false, follow: true },
    };
  }
  return {
    title: "Generate",
    description:
      "Upload a photo of a toy you own, choose a listing, reveal, or social-video recipe, and generate a short clip to review and export.",
    alternates: { canonical: "/create" },
  };
}

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{
    effect?: string;
    model?: string;
    mode?: string;
    prompt?: string;
    source?: string;
    ratio?: string;
    duration?: string;
    channel?: string;
  }>;
}) {
  const sp = await searchParams;

  return (
    <>
      {/* V2 tool core — remix deep link: effect/source/ratio/duration/channel */}
      <CreateStudio
        initialEffect={sp.effect}
        initialModel={sp.model}
        initialMode={sp.mode === "t2v" ? "t2v" : "i2v"}
        initialPrompt={sp.prompt}
        initialSource={sp.source}
        initialRatio={sp.ratio}
        initialDuration={sp.duration}
        initialChannel={sp.channel}
      />
      {/* SSR landing copy + internal links for crawlers */}
      <CreateSeoFooter effectSlug={sp.effect} />
    </>
  );
}
