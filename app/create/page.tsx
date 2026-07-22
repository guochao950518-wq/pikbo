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
  searchParams: Promise<{ effect?: string }>;
}) {
  const { effect } = await searchParams;

  return <CreateStudio initialEffect={effect} />;
}
