"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

/**
 * Soft-launch conversion strip (哥飞 P0): honest free trial + primary Generate CTA.
 * Sits above the fold on Explore home — not a multi-step tour.
 */
export function SoftLaunchStrip() {
  return (
    <div className="border-b border-[#c8ff3d]/25 bg-gradient-to-r from-[#c8ff3d]/[0.12] via-black to-black px-3 py-2.5 sm:px-5">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2">
        <p className="text-[12px] leading-snug text-white/80 sm:text-[13px]">
          <span className="font-black text-[#c8ff3d]">Free Mini trial</span>
          <span className="text-white/50"> · </span>
          Photo → short AI video · no card · failed live jobs refund credits
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/create?try=1&sample=scout"
            onClick={() =>
              track({
                event: "landing_view",
                path: "/",
                meta: { cta: "soft_launch_try" },
              })
            }
            className="rounded-full bg-[#c8ff3d] px-4 py-1.5 text-[12px] font-black text-black shadow-[0_0_20px_rgba(200,255,61,0.25)]"
          >
            Try free video
          </Link>
          <Link
            href="/create"
            onClick={() =>
              track({
                event: "landing_view",
                path: "/",
                meta: { cta: "soft_launch_generate" },
              })
            }
            className="rounded-full border border-white/20 px-3 py-1.5 text-[12px] font-bold text-white/85 hover:border-[#c8ff3d]/40"
          >
            Open Generate
          </Link>
        </div>
      </div>
    </div>
  );
}
