import { redirect } from "next/navigation";

export default async function LegacyAppModePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/create?mode=${encodeURIComponent(slug)}`);
}
