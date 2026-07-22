import type { Metadata } from "next";
import { CreateStudio } from "@/components/CreateStudio";

export const metadata: Metadata = {
  title: "Create a clip",
  description:
    "Upload a photo of your designer toy, pick an effect, and generate a shareable video in seconds.",
};

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ effect?: string }>;
}) {
  const { effect } = await searchParams;

  return (
    <div className="container-x py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Studio</h1>
        <p className="mt-2 text-[var(--fg-muted)]">
          Upload → pick an effect → get your clip.
        </p>
      </div>
      <CreateStudio initialEffect={effect} />
    </div>
  );
}
