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
      alternates: { canonical: `/create?effect=${preset.slug}` },
    };
  }
  return {
    title: "Generate",
    description:
      "AI image-to-video studio for designer toys. Upload a figure photo, pick a preset, generate with ByteDance Seedance.",
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
  }>;
}) {
  const sp = await searchParams;

  return (
    <>
      {/* V2 tool core */}
      <CreateStudio
        initialEffect={sp.effect}
        initialModel={sp.model}
        initialMode={sp.mode === "t2v" ? "t2v" : "i2v"}
        initialPrompt={sp.prompt}
      />
      {/* SSR landing copy + internal links for crawlers */}
      <CreateSeoFooter effectSlug={sp.effect} />
    </>
  );
}
