import type { Metadata } from "next";
import Link from "next/link";
import { ProfilePanel } from "@/components/ProfilePanel";
import { publicAuthStatus } from "@/lib/authConfig";

export const metadata: Metadata = {
  title: "Profile",
  description: "Plan, credits, and your Pikbo session.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  const auth = publicAuthStatus();

  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-lg">
        <span className="chip">Account</span>
        <h1 className="mt-3 text-2xl font-bold">Profile</h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Guest session for now — credits live in a signed cookie on this
          device.
        </p>
        <p className="mt-3 text-xs text-[var(--fg-dim)]">
          {auth.message}{" "}
          <Link href="/login" className="text-[var(--mint)] hover:underline">
            Sign-in status →
          </Link>
        </p>
        <ProfilePanel />
      </div>
    </div>
  );
}
