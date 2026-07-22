import { redirect } from "next/navigation";

/** Alias used by big AI video apps */
export default async function GenerateAliasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") q.set(k, v);
    else if (Array.isArray(v) && v[0]) q.set(k, v[0]);
  }
  const s = q.toString();
  redirect(s ? `/create?${s}` : "/create");
}
