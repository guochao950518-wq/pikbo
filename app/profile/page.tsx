import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Profile",
  description: "Plan, credits, and account.",
};

export default function ProfilePage() {
  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Guest session today — login coming with Supabase.
        </p>

        <div className="card mt-8 space-y-4 p-6">
          <div className="flex items-center gap-3">
            <div
              className="grid h-14 w-14 place-items-center rounded-full text-xl font-bold"
              style={{ background: "var(--grad)" }}
            >
              G
            </div>
            <div>
              <p className="font-semibold">Guest creator</p>
              <p className="text-xs text-[var(--fg-dim)]">Cookie session</p>
            </div>
          </div>
          <div className="border-t border-[var(--border)] pt-4 text-sm text-[var(--fg-muted)]">
            Credits and plan show in the header badge. Manage billing on Pricing.
          </div>
          <Link href="/pricing" className="btn btn-primary w-full text-sm">
            Manage plan
          </Link>
        </div>
      </div>
    </div>
  );
}
