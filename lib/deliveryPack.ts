/**
 * Post-clip delivery checklist — first principles.
 *
 * Physics: a clip only creates value when exported/posted.
 * Not a 妙呀 IP asset package. Not a new product surface.
 * Just: after generate, what job remains for THIS clip.
 */

import type { JobIntentId } from "@/lib/jobIntents";

export type DeliveryItem = {
  id: string;
  label: string;
  /** Optional deep link when the action is in-app */
  href?: string;
};

/**
 * Static next steps after a successful clip.
 * Job-aware copy only — no fake "posted" tracking.
 */
export function deliveryItemsForJob(
  jobId: JobIntentId | null | undefined,
  opts?: { demo?: boolean }
): DeliveryItem[] {
  const demo = Boolean(opts?.demo);
  const items: DeliveryItem[] = [
    {
      id: "download",
      label: demo
        ? "Label is clear: this is a Lab demo — run Live for your photo"
        : "Download the MP4 (or copy link)",
    },
  ];

  switch (jobId) {
    case "etsy-listing":
      items.push({
        id: "post",
        label: "Add to listing gallery (1:1) · verify sculpt vs real product",
      });
      items.push({
        id: "next",
        label: "Same photo → TikTok hook or Seller Pack",
        href: "/create?job=tiktok-hook",
      });
      break;
    case "tiktok-hook":
      items.push({
        id: "post",
        label: "Post 9:16 with product link in bio/caption",
      });
      items.push({
        id: "next",
        label: "Same photo → listing spin for the shop",
        href: "/create?job=etsy-listing",
      });
      break;
    case "blind-box-drop":
      items.push({
        id: "post",
        label: "Use for drop-day / restock story · keep spoilers honest",
      });
      items.push({
        id: "next",
        label: "Same photo → shelf glam for PDP",
        href: "/create?job=shelf-display",
      });
      break;
    case "shelf-display":
      items.push({
        id: "post",
        label: "PDP / collection post · check paint under lighting",
      });
      items.push({
        id: "next",
        label: "Same photo → Seller Pack (3 clips)",
        href: "/create?mode=seller-pack",
      });
      break;
    case "seller-pack":
      items.push({
        id: "post",
        label: "Export all three · listing + reveal + social",
      });
      items.push({
        id: "next",
        label: "Open Library to re-download the set",
        href: "/library",
      });
      break;
    default:
      items.push({
        id: "post",
        label: "Post where this job was meant for (shop or social)",
      });
      items.push({
        id: "next",
        label: "Same photo → another job, or Seller Pack ×3",
        href: "/create?mode=seller-pack",
      });
  }

  return items;
}
