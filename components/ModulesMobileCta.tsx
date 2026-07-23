"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

/** Sticky mobile CTA on Modules wall — above AppShell tab nav */
export function ModulesMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-[4.75rem] z-40 border-t border-white/10 bg-black/90 px-4 py-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
      <div className="flex gap-2">
        <Link
          href="/create?try=1&sample=scout"
          onClick={() =>
            track({
              event: "landing_view",
              path: "/modules",
              meta: { cta: "try_free" },
            })
          }
          className="btn btn-primary min-w-0 flex-1 py-3 text-sm"
        >
          Try free · 10s
        </Link>
        <Link
          href="/create?mode=seller-pack"
          onClick={() =>
            track({
              event: "landing_view",
              path: "/modules",
              meta: { cta: "seller_pack" },
            })
          }
          className="btn btn-ghost shrink-0 px-3 py-3 text-xs"
        >
          Seller Pack
        </Link>
      </div>
    </div>
  );
}
