import type { Metadata } from "next";
import { CreateStudio } from "@/components/CreateStudio";

export const metadata: Metadata = {
  title: "Generate",
  description:
    "AI image-to-video studio powered by ByteDance Seedance. Upload a reference, pick a preset, generate.",
};

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
    <CreateStudio
      initialEffect={sp.effect}
      initialModel={sp.model}
      initialMode={sp.mode === "t2v" ? "t2v" : "i2v"}
      initialPrompt={sp.prompt}
    />
  );
}
