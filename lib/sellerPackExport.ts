/**
 * Seller Pack export helpers — only include actually available deliverables.
 * No fake ZIP of failed/missing children (Phase F).
 */

export type SellerPackExportItem = {
  key: string;
  slug: string;
  label: string;
  status: string;
  videoUrl?: string;
  demo?: boolean;
  watermark?: boolean;
  creditState?: string;
  /** When false, Download is blocked (free live raw). */
  downloadable: boolean;
};

export function filterAvailableDeliverables(
  items: SellerPackExportItem[]
): SellerPackExportItem[] {
  return items.filter(
    (i) =>
      i.status === "succeeded" &&
      typeof i.videoUrl === "string" &&
      i.videoUrl.length > 0 &&
      i.downloadable
  );
}

/** CSV of available clips only. Empty string if none. */
export function sellerPackCsv(items: SellerPackExportItem[]): string {
  const rows = filterAvailableDeliverables(items);
  if (rows.length === 0) return "";
  const header = [
    "key",
    "slug",
    "label",
    "demo",
    "videoUrl",
    "creditState",
  ].join(",");
  const body = rows.map((r) =>
    [
      r.key,
      r.slug,
      JSON.stringify(r.label),
      r.demo ? "cached" : "live",
      r.videoUrl,
      r.creditState || "",
    ].join(",")
  );
  return [header, ...body].join("\n");
}

/** Manifest JSON for support / future ZIP packer. */
export function sellerPackManifest(items: SellerPackExportItem[]): {
  version: 1;
  exportedAt: string;
  availableCount: number;
  skippedCount: number;
  items: SellerPackExportItem[];
  note: string;
} {
  const available = filterAvailableDeliverables(items);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    availableCount: available.length,
    skippedCount: items.length - available.length,
    items: available,
    note:
      "Only succeeded, downloadable clips are listed. Failed siblings and Free raw URLs are omitted.",
  };
}

export function canExportSellerPack(items: SellerPackExportItem[]): boolean {
  return filterAvailableDeliverables(items).length > 0;
}
