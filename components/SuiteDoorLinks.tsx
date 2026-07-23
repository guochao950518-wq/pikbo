import Link from "next/link";

/**
 * Compact suite doors for SEO landings (/for, /tools, /toys, guides).
 * Always real deep links — never fake multi-model.
 */
export function SuiteDoorLinks({
  effectSlug,
  className = "",
}: {
  /** Prefill Generate with this recipe when set */
  effectSlug?: string;
  className?: string;
}) {
  const generateHref = effectSlug
    ? `/create?effect=${encodeURIComponent(effectSlug)}`
    : "/create";

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Link href={generateHref} className="btn btn-primary !px-4 !py-2 text-xs">
        Open Generate
      </Link>
      <Link href="/modules" className="btn btn-ghost !px-3 !py-2 text-xs">
        Modules
      </Link>
      <Link
        href="/create?mode=seller-pack"
        className="btn btn-ghost !px-3 !py-2 text-xs"
      >
        Seller Pack
      </Link>
      <Link
        href="/create?try=1&sample=scout"
        className="btn btn-ghost !px-3 !py-2 text-xs"
      >
        Try free
      </Link>
    </div>
  );
}
